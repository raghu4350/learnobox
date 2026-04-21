from fastapi import APIRouter
from pydantic import BaseModel
from typing import Any, List
import numpy as np

# NEW IMPORTS
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense
from sklearn.preprocessing import MinMaxScaler

router = APIRouter()

class RNNTrainRequest(BaseModel):
    sequence: List[Any]
    mode: str
    learning_rate: float
    epochs: int
    hidden_units: int
    sequence_length: int


@router.post("/train")
def train_rnn(req: RNNTrainRequest):
    np.random.seed(42)

    seq = req.sequence
    if not seq or len(seq) < 3:
        return {"error": "Sequence too small"}

    mode = req.mode
    epochs = int(req.epochs)
    hidden_size = int(req.hidden_units)
    seq_len = int(req.sequence_length)

    # -------------------------------
    # 🔹 TEXT MODE (kept simple)
    # -------------------------------
    if mode == "text":
        words = seq if isinstance(seq, list) else seq.split()
        vocab = sorted(list(set(words)))

        word_to_int = {w: i for i, w in enumerate(vocab)}
        int_to_word = {i: w for w, i in word_to_int.items()}

        data = np.array([word_to_int[w] for w in words])

        if len(data) < seq_len + 1:
            return {"error": "Text sequence too short"}

        # create sequences
        X, Y = [], []
        for i in range(len(data) - seq_len):
            X.append(data[i:i+seq_len])
            Y.append(data[i+seq_len])

        X = np.array(X)
        Y = np.array(Y)

        # reshape for LSTM
        X = X.reshape((X.shape[0], X.shape[1], 1))

        model = Sequential([
            SimpleRNN(hidden_size, input_shape=(seq_len,1)),
            Dense(len(vocab), activation="softmax")
        ])

        model.compile(optimizer='adam', loss='sparse_categorical_crossentropy')
        history = model.fit(X, Y, epochs=epochs, verbose=0)

        loss_per_epoch = history.history['loss']

        # prediction
        last_seq = data[-seq_len:]
        last_seq = last_seq.reshape(1, seq_len, 1)

        probs = model.predict(last_seq, verbose=0)
        idx = int(np.argmax(probs))
        prediction = int_to_word[idx]

        gate_values = {"forget": [], "input": [], "output": []}
        hidden_states = []

    # -------------------------------
    # 🔹 NUMBER MODE (FIXED PROPERLY)
    # -------------------------------
    else:
        data = np.array(seq, dtype=float).reshape(-1, 1)

        if len(data) < seq_len + 2:
            return {"error": "Sequence too short for given sequence_length"}

        # ✅ Proper normalization
        scaler = MinMaxScaler()
        data = scaler.fit_transform(data)

        # create sequences
        X, Y = [], []
        for i in range(len(data) - seq_len):
            X.append(data[i:i+seq_len])
            Y.append(data[i+seq_len])

        X = np.array(X)
        Y = np.array(Y)

        # reshape for LSTM (3D)
        X = X.reshape((X.shape[0], X.shape[1], 1))

        # ✅ Proper RNN model
        model = Sequential([
            SimpleRNN(hidden_size, activation='relu', input_shape=(seq_len,1)),
            Dense(1)
        ])

        model.compile(optimizer='adam', loss='mse')
        if len(data) < 50:
            epochs = max(epochs, 200) # Guarantee numeric convergence over small sequence sizes

        history = model.fit(X, Y, epochs=epochs, verbose=0)

        loss_per_epoch = history.history['loss']

        # ✅ Prediction
        last_seq = data[-seq_len:]
        last_seq = last_seq.reshape(1, seq_len, 1)

        y_pred = model.predict(last_seq, verbose=0)

        prediction = scaler.inverse_transform(y_pred)[0][0]
        prediction = round(float(prediction), 3)

        # ✅ Extract hidden states using Functional API for visualization
        from tensorflow.keras.models import Model
        
        # Build an intermediate model that returns sequences
        lstm_layer_seq = SimpleRNN(hidden_size, activation='relu', return_sequences=True, input_shape=(seq_len, 1))
        seq_model = Sequential([lstm_layer_seq])
        # Transfer weights from trained LSTM layer
        seq_model.layers[0].set_weights(model.layers[0].get_weights())
        
        h_states = seq_model.predict(last_seq, verbose=0)[0] # shape (seq_len, hidden_size)
        hidden_states = h_states.tolist()
        
        # Gate values placeholder (true gate extraction is mathematically complex in standard Keras)
        gate_values = {"forget": [], "input": [], "output": []}

    # -------------------------------
    # 🔹 FINAL RESPONSE (UNCHANGED FORMAT)
    # -------------------------------
    return {
        "prediction": prediction,
        "loss_per_epoch": [float(x) for x in loss_per_epoch],
        "hidden_states": hidden_states,
        "gate_values": gate_values
    }
