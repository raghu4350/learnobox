from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import os

# Suppress TF logging to console to keep output clean
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import confusion_matrix, classification_report
import tensorflow as tf

router = APIRouter()

# Global store for prediction
model_store = {
    "weights": None,
    "mean": None,
    "scale": None
}

class PredictRequest(BaseModel):
    hours: float
    attendance: float

class TrainRequest(BaseModel):
    data: List[List[float]]
    learning_rate: float = 0.01
    epochs: int = 100
    hidden_layers: List[int] = [16, 8]
    hours: float = 6.0         # Default required for prediction feature
    attendance: float = 75.0   # Default required for prediction feature

@router.post("/train")
def train_mlp_tf(req: TrainRequest):
    data = np.array(req.data)
    
    # 1. DATA HANDLING & REALISTIC DATA (IF SMALL DATASET)
    if len(data) < 20: 
        np.random.seed(42)
        syn_hours = np.random.uniform(1, 10, 100)
        syn_attendance = np.random.uniform(40, 100, 100)
        
        # pass if (hours + attendance/10 > threshold)
        passes = (syn_hours + syn_attendance / 10 > 12).astype(float)
        
        # Add noise to reduce overconfident 99.9% bounds
        flip_indices = np.random.choice(100, size=15, replace=False) # 15% noise
        passes[flip_indices] = 1 - passes[flip_indices]
        
        X = np.column_stack((syn_hours, syn_attendance))
        y = passes.reshape(-1, 1)
        
        orig_X = data[:, :-1]
        orig_y = data[:, -1].reshape(-1, 1)
        X = np.vstack((X, orig_X))
        y = np.vstack((y, orig_y))
    else:
        X = data[:, :-1]
        y = data[:, -1].reshape(-1, 1)

    orig_X_for_ui = data[:, :-1] 

    # 2. TRAIN-TEST SPLIT
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, shuffle=True, random_state=42
    )

    # 3. FEATURE SCALING
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    orig_X_scaled = scaler.transform(orig_X_for_ui)

    # 4. MODEL
    tf.keras.backend.clear_session()
    tf.random.set_seed(42)
    
    model = tf.keras.Sequential()
    # Dynamically build hidden layers from frontend parameter
    hidden_layers = req.hidden_layers if req.hidden_layers else [16, 8]
    for i, units in enumerate(hidden_layers):
        if i == 0:
            model.add(tf.keras.layers.Dense(units, activation='relu', input_shape=(2,), kernel_regularizer=tf.keras.regularizers.l2(0.01)))
        else:
            model.add(tf.keras.layers.Dense(units, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01)))
        model.add(tf.keras.layers.Dropout(0.2))
    model.add(tf.keras.layers.Dense(1, activation='sigmoid'))

    # 5. COMPILATION
    optimizer = tf.keras.optimizers.Adam(learning_rate=req.learning_rate)
    model.compile(optimizer=optimizer, loss='binary_crossentropy', metrics=['accuracy'])

    # 6. TRAINING
    batch_size = 4 if len(X_train) < 50 else 8
    epochs = min(req.epochs, 150)
    
    class EpochWeightsCallback(tf.keras.callbacks.Callback):
        def __init__(self):
            super().__init__()
            self.weights_per_epoch = []
            
        def on_epoch_end(self, epoch, logs=None):
            w_list = [w.tolist() for w in self.model.get_weights()]
            self.weights_per_epoch.append(w_list)

    weight_cb = EpochWeightsCallback()
    
    history = model.fit(
        X_train_scaled, y_train,
        epochs=epochs,
        batch_size=batch_size,
        validation_split=0.1,
        verbose=0,
        callbacks=[weight_cb]
    )

    # 7. EVALUATION
    train_loss, train_acc = model.evaluate(X_train_scaled, y_train, verbose=0)
    test_loss, test_acc = model.evaluate(X_test_scaled, y_test, verbose=0)

    # 8. CONFUSION MATRIX & CLASSIFICATION REPORT
    y_test_pred_prob = model.predict(X_test_scaled, verbose=0)
    y_test_pred = (y_test_pred_prob >= 0.5).astype(int)
    
    cm = confusion_matrix(y_test, y_test_pred)
    if cm.shape == (2, 2):
        tn, fp, fn, tp = cm.ravel()
    else:
        # Handling edge cases where y_test might have only 1 unique label
        tn, fp, fn, tp = int(cm[0,0] if y_test[0] == 0 else 0), 0, 0, int(cm[0,0] if y_test[0] == 1 else 0)

    cr = classification_report(y_test, y_test_pred, output_dict=True, zero_division=0)

    # 10. PREDICTION FEATURE
    custom_X = np.array([[req.hours, req.attendance]])
    custom_X_scaled = scaler.transform(custom_X)
    custom_pred_prob = float(model.predict(custom_X_scaled, verbose=0)[0][0])
    custom_pred_label = "Pass" if custom_pred_prob >= 0.5 else "Fail"

    # UI predictions format extraction
    all_preds_prob = model.predict(orig_X_scaled, verbose=0)
    all_preds = (all_preds_prob >= 0.5).astype(int).flatten().tolist()

    # Store for manual prediction
    model_store["weights"] = model.get_weights()
    model_store["mean"] = scaler.mean_
    model_store["scale"] = scaler.scale_
    model_store["hidden_layers"] = req.hidden_layers if req.hidden_layers else [16, 8]

    # 9. GRAPH DATA & FINALIZE RESPONSE
    loss_per_epoch = history.history.get('loss', [])
    val_loss_per_epoch = history.history.get('val_loss', [])

    return {
        "train_accuracy": float(train_acc) * 100, # UI expects values like 85.0 for 85.0%
        "test_accuracy": float(test_acc) * 100,
        "loss_per_epoch": [float(x) for x in loss_per_epoch],
        "val_loss_per_epoch": [float(x) for x in val_loss_per_epoch],
        "weights_per_epoch": weight_cb.weights_per_epoch,
        "confusion_matrix": {
            "TP": int(tp),
            "TN": int(tn),
            "FP": int(fp),
            "FN": int(fn)
        },
        "classification_report": cr,
        "prediction": custom_pred_label,
        "confidence": custom_pred_prob,
        "predictions": all_preds # original backward compatibility for UI
    }

@router.post("/predict")
def predict_mlp_endpoint(req: PredictRequest):
    if model_store["weights"] is None:
        return {"error": "Model not trained yet."}
        
    # Recreate architecture identically with Dropouts & L2 matching
    model = tf.keras.Sequential()
    stored_layers = model_store.get("hidden_layers", [16, 8])
    for i, units in enumerate(stored_layers):
        if i == 0:
            model.add(tf.keras.layers.Dense(units, activation='relu', input_shape=(2,), kernel_regularizer=tf.keras.regularizers.l2(0.01)))
        else:
            model.add(tf.keras.layers.Dense(units, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.01)))
        model.add(tf.keras.layers.Dropout(0.2))
    model.add(tf.keras.layers.Dense(1, activation='sigmoid'))
    model.set_weights(model_store["weights"])
    
    # Scale input
    X = np.array([[req.hours, req.attendance]])
    X_scaled = (X - model_store["mean"]) / model_store["scale"]
    
    # Predict
    prob = float(model.predict(X_scaled, verbose=0)[0][0])
    label = "Pass" if prob >= 0.5 else "Fail"
    
    return {
        "prediction": label,
        "confidence": prob
    }
