from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import numpy as np

router = APIRouter()

# Global store for weights
model_store = {
    "weights": None,
    "size": 0
}

class StoreRequest(BaseModel):
    patterns: List[List[List[int]]]

class RecallRequest(BaseModel):
    input_pattern: List[List[int]]

# -------------------------------
# 🔹 Helper Functions
# -------------------------------
def to_bipolar(pattern):
    return np.where(pattern == 0, -1, 1)

def to_binary(pattern):
    return np.where(pattern <= 0, 0, 1)

def calculate_energy(x, W):
    return float(-0.5 * np.dot(x.T, np.dot(W, x)))

# -------------------------------
# 🔹 STORE PATTERNS (FIXED)
# -------------------------------
@router.post("/store")
def store_patterns(req: StoreRequest):
    patterns = np.array(req.patterns)

    if len(patterns) == 0:
        return {"error": "No patterns provided"}

    num_patterns, rows, cols = patterns.shape
    size = rows * cols

    W = np.zeros((size, size))

    for p in patterns:
        p_flat = p.flatten()
        p_bipolar = to_bipolar(p_flat)
        W += np.outer(p_bipolar, p_bipolar)

    # remove self-connections
    np.fill_diagonal(W, 0)

    # 🔥 better normalization (important fix)
    W = W / num_patterns

    model_store["weights"] = W
    model_store["size"] = size

    return {
        "message": "Patterns stored successfully in Hopfield Network.",
        "num_patterns": num_patterns
    }

# -------------------------------
# 🔹 RECALL PATTERN (FIXED)
# -------------------------------
@router.post("/recall")
def recall_pattern(req: RecallRequest):
    if model_store["weights"] is None:
        return {"error": "No patterns stored yet. Please store patterns first."}

    W = model_store["weights"]

    input_arr = np.array(req.input_pattern)
    rows, cols = input_arr.shape

    # convert to bipolar
    x = to_bipolar(input_arr.flatten())

    max_iter = 100
    energies = []
    energies.append(calculate_energy(x, W))
    
    # Track the initial state as step 0
    states = [to_binary(x).reshape(rows, cols).tolist()]

    n = len(x)

    # 🔥 ASYNCHRONOUS UPDATE (KEY FIX)
    for _ in range(max_iter):
        prev_x = x.copy()

        # update neurons one by one in random order
        for i in np.random.permutation(n):
            net = np.dot(W[i], x)
            x[i] = 1 if net >= 0 else -1

        energies.append(calculate_energy(x, W))
        states.append(to_binary(x).reshape(rows, cols).tolist())

        # stop if stable
        if np.array_equal(prev_x, x):
            break

    recovered_pattern = to_binary(x).reshape(rows, cols).tolist()

    return {
        "recalled_pattern": recovered_pattern,
        "iterations": len(energies) - 1,
        "energy": [float(e) for e in energies],
        "states_per_iteration": states
    }
