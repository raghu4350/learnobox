from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np
import json

router = APIRouter()

class CNNTrainRequest(BaseModel):
    image: str
    learning_rate: float
    epochs: int
    filters: int
    kernel_size: int

# Cache the dataset to avoid repeated downloads or processing
_cifar_cache = None

def get_mini_cifar():
    global _cifar_cache
    if _cifar_cache is not None:
        return _cifar_cache
        
    try:
        from tensorflow.keras.datasets import cifar10
        (x_train, y_train), _ = cifar10.load_data()
        
        # CIFAR-10 labels: Cat is 3, Dog is 5
        cat_indices = np.where(y_train == 3)[0]
        dog_indices = np.where(y_train == 5)[0]
        
        # Take 300 of each
        sample_size = 300
        cat_samples = cat_indices[:sample_size]
        dog_samples = dog_indices[:sample_size]
        
        all_indices = np.concatenate([cat_samples, dog_samples])
        np.random.shuffle(all_indices)
        
        x_mini = x_train[all_indices].astype("float32") / 255.0 # shape (600, 32, 32, 3)
        y_mini = y_train[all_indices]
        
        # Relabel: Cat (3) -> 0, Dog (5) -> 1
        y_binary = np.where(y_mini == 3, 0, 1)
        
    except Exception as e:
        print(f"Warning: Failed to load CIFAR-10 ({str(e)}). Using offline fallback dataset.")
        # Fallback offline generated dataset (600 samples, 2 classes)
        np.random.seed(42)
        x_mini = np.random.rand(600, 32, 32, 3).astype("float32")
        y_binary = np.random.randint(0, 2, (600, 1))
    
    _cifar_cache = (x_mini, y_binary)
    return _cifar_cache

@router.post("/train")
def train_cnn(req: CNNTrainRequest):
    import tensorflow as tf
    from tensorflow.keras.models import Sequential, Model
    from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
    from tensorflow.keras.optimizers import Adam
    
    # 1. Parse Image Input (Expects 32x32x3 = 3072 values)
    try:
        pixels = json.loads(req.image)
        if len(pixels) == 32 * 32 * 3:
            img_arr = np.array(pixels, dtype=float).reshape(1, 32, 32, 3)
        else:
            raise ValueError(f"Invalid array format. Expected 3072, got {len(pixels)}")
    except Exception as e:
        print(f"Image parsing error: {e}")
        img_arr = np.zeros((1, 32, 32, 3))
        
    lr = float(req.learning_rate)
    epochs = min(max(int(req.epochs), 1), 50) 
    num_filters = min(max(int(req.filters), 1), 32)
    k_size = min(max(int(req.kernel_size), 2), 7)
    
    # 2. Get Data
    X, y = get_mini_cifar()
    
    # 3. Build Model (Binary Classifier)
    model = Sequential([
        Conv2D(num_filters, kernel_size=(k_size, k_size), activation='relu', input_shape=(32, 32, 3), name="conv1"),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        Flatten(),
        Dense(32, activation='relu'),
        Dropout(0.5),
        Dense(2, activation='softmax') # Binary: 0=Cat, 1=Dog
    ])
    
    model.compile(optimizer=Adam(learning_rate=lr), 
                  loss='sparse_categorical_crossentropy', 
                  metrics=['accuracy'])
    
    # 4. Train Model
    history = model.fit(X, y, epochs=epochs, validation_split=0.2, verbose=0)
    
    # Extract metrics
    loss_history = history.history['loss']
    val_loss_history = history.history['val_loss']
    acc_history = history.history['accuracy']
    val_acc_history = history.history['val_accuracy']
    
    # 5. Predict on User Input
    probs = model.predict(img_arr, verbose=0)[0]
    pred_idx = int(np.argmax(probs))
    confidence = float(probs[pred_idx] * 100)
    class_name = "Dog 🐶" if pred_idx == 1 else "Cat 🐱"
    
    # 6. Extract Feature Maps and Filters
    conv_layer = model.get_layer("conv1")
    weights, biases = conv_layer.get_weights() # weights shape: (k_size, k_size, 3, num_filters)
    
    # Build sub-model to get activations
    activation_model = Model(inputs=model.inputs, outputs=conv_layer.output)
    activations = activation_model.predict(img_arr, verbose=0)[0] # shape: (32-k+1, 32-k+1, num_filters)
    
    feature_maps = []
    filters_extracted = []
    
    max_maps_to_return = min(num_filters, 4)
    for f in range(max_maps_to_return):
        # Extract Feature Map
        fm = activations[:, :, f]
        
        # Let frontend handle the raw dimension, but for uniformity we can flatten it directly
        # The frontend will calculate Math.sqrt to perfectly render any square activation Map!
        feature_maps.append(fm.flatten().tolist())
        
        # Extract Filter (Average across 3 RGB channels to produce a 2D visualization mapped grid)
        filt = np.mean(weights[:, :, :, f], axis=2)
        filters_extracted.append(filt.flatten().tolist())
    
    return {
        "prediction": class_name,
        "confidence": confidence,
        "loss_per_epoch": [float(v) for v in loss_history],
        "val_loss_per_epoch": [float(v) for v in val_loss_history],
        "acc_per_epoch": [float(v) for v in acc_history],
        "val_acc_per_epoch": [float(v) for v in val_acc_history],
        "feature_maps": feature_maps,
        "filters": filters_extracted,
        "probs": [float(v) for v in probs]
    }
