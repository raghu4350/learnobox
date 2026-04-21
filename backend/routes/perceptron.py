from fastapi import APIRouter
from pydantic import BaseModel
import numpy as np

router = APIRouter()

class TrainRequest(BaseModel):
    data: list[list[float]] # [hours, attendance, label]
    learning_rate: float
    epochs: int
    weights: list[float]
    bias: float

def generate_synthetic_data(n=100):
    np.random.seed(42)
    # Features: hours (0-10), attendance (50-100)
    hours = np.random.uniform(0, 10, n)
    attendance = np.random.uniform(50, 100, n)
    
    # Higher values -> higher probability of pass, added small randomness (noise)
    score = hours * 1.5 + (attendance - 50) * 0.2 + np.random.normal(0, 2, n)
    labels = (score > 12).astype(int)
    
    return np.column_stack((hours, attendance, labels)).tolist()

@router.post("/train")
def train_perceptron(req: TrainRequest):
    # logic (numpy only)
    data_input = np.array(req.data)
    if data_input.shape[1] != 3:
        return {"error": "data must be N x 3 array [x1, x2, label]"}
    
    X_input_raw = data_input[:, :2] # Original data used for testing/returning
    y_input_raw = data_input[:, 2]

    # Generate better synthetic dataset if no CSV is provided (assuming default length 6)
    if len(req.data) <= 6:
        dataset = np.array(generate_synthetic_data(100))
        X_dataset = dataset[:, :2]
        y_dataset = dataset[:, 2]
    else:
        X_dataset = X_input_raw
        y_dataset = y_input_raw

    # Normalize input features (study hours, attendance) using Min-Max scaling
    X_min = X_dataset.min(axis=0)
    X_max = X_dataset.max(axis=0)
    diff = X_max - X_min
    diff[diff == 0] = 1.0 # prevent division by zero
    
    X_scaled = (X_dataset - X_min) / diff
    
    # Shuffle dataset and split into: 80% training, 20% testing
    num_samples = len(X_scaled)
    indices = np.arange(num_samples)
    np.random.shuffle(indices)
    
    split_idx = int(0.8 * num_samples)
    train_idx, test_idx = indices[:split_idx], indices[split_idx:]
    
    X_train, y_train = X_scaled[train_idx], y_dataset[train_idx]
    X_test, y_test = X_scaled[test_idx], y_dataset[test_idx]

    w = np.array(req.weights, dtype=float)
    b = float(req.bias)
    lr = float(req.learning_rate)
    epochs = min(int(req.epochs), 50) # Limit epochs (max 50)
    
    loss_per_epoch = []
    weights_per_epoch = []
    bias_per_epoch = []
    
    # Train model only on training data
    for epoch in range(epochs):
        # Prevent overfitting: Shuffle data every epoch
        epoch_indices = np.arange(len(X_train))
        np.random.shuffle(epoch_indices)
        
        X_train_shuffled = X_train[epoch_indices]
        y_train_shuffled = y_train[epoch_indices]
        
        misclassifications = 0
        for i in range(len(X_train_shuffled)):
            x_i = X_train_shuffled[i]
            y_i = y_train_shuffled[i]
            
            # z = w.x + b
            z = np.dot(w, x_i) + b
            
            # Use strict step activation
            y_pred = 1.0 if z >= 0 else 0.0
            
            error = y_i - y_pred
            
            if error != 0:
                misclassifications += 1
                w += lr * error * x_i
                b += lr * error
                
        # Store loss and weights snapshot at end of each epoch
        loss_per_epoch.append(int(misclassifications))
        weights_per_epoch.append(w.tolist())
        bias_per_epoch.append(float(b))
        
        # Optional early stopping
        if misclassifications == 0:
            break
            
    # Evaluation helper
    def forward(X_data):
        z = np.dot(X_data, w) + b
        return (z >= 0).astype(int)

    # Evaluate model on test data
    train_preds = forward(X_train)
    test_preds = forward(X_test)
    
    train_accuracy = float(np.mean(train_preds == y_train))
    test_accuracy = float(np.mean(test_preds == y_test))

    # Scale the original inputs via the trained Min-Max parameters to keep API expectations intact
    X_input_scaled = (X_input_raw - X_min) / diff
    frontend_preds = forward(X_input_scaled)

    # Return required metrics while returning standard frontend format to avoid breaking UI structure
    return {
        "final_weights": w.tolist(),
        "final_bias": float(b),
        "loss_per_epoch": loss_per_epoch,
        "weights_per_epoch": weights_per_epoch,
        "bias_per_epoch": bias_per_epoch,
        "predictions": frontend_preds.tolist(),
        
        "train_accuracy": float(train_accuracy),
        "test_accuracy": float(test_accuracy),
        "test_inputs": X_dataset[test_idx].tolist(),
        "test_predictions": test_preds.tolist(),
        "actual_labels": y_test.tolist()
    }

