# 🧠 LearnoBox — Neural Network Learning Platform

<div align="center">

![Platform](https://img.shields.io/badge/Platform-Web%20App-blueviolet?style=for-the-badge)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react)
![AI](https://img.shields.io/badge/AI-TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**An interactive, full-stack educational platform to visually explore, train, and understand neural network models — right in your browser.**

</div>

---

## 📖 Table of Contents
DEPLOY LINK - https://learnobox-six.vercel.app/#

- [What is LearnoBox?](#-what-is-learnobox)
- [Architecture Overview](#-architecture-overview)
- [Neural Network Models](#-neural-network-models)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Reference](#-api-reference)
- [Performance Notes](#-performance-notes)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 What is LearnoBox?

**LearnoBox** is a hands-on neural network learning platform built for students, developers, and AI enthusiasts. It allows you to:

- 🎛️ **Configure** neural network hyperparameters (learning rate, epochs, hidden units, etc.)
- ▶️ **Train** real models on real datasets — live in the browser
- 📊 **Visualize** training loss curves, predictions, feature maps, and hidden states
- 🧪 **Experiment** with 6 different neural network architectures

No Jupyter notebooks. No complex setup. Just open the browser and learn.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                             │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │            React + Vite Frontend (Port 5173)            │   │
│   │                                                         │   │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────┐  │   │
│   │   │Perceptron│  │   MLP    │  │   CNN    │  │ LSTM │  │   │
│   │   └──────────┘  └──────────┘  └──────────┘  └──────┘  │   │
│   │   ┌──────────┐  ┌──────────┐                           │   │
│   │   │   RNN    │  │Hopfield  │                           │   │
│   │   └──────────┘  └──────────┘                           │   │
│   └────────────────────┬────────────────────────────────────┘   │
│                        │ HTTP / REST API                        │
└────────────────────────┼────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│              FastAPI Backend (Port 8000)                        │
│                                                                 │
│   /perceptron  /mlp  /cnn  /lstm  /rnn  /hopfield              │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │           TensorFlow / NumPy / Scikit-learn             │   │
│   │              (Real model training per request)          │   │
│   └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 Neural Network Models

### 1. 🔵 Perceptron — The Foundation

The simplest neural network unit — one neuron, one decision boundary.

```
Input 1 ──┐
           ├──► [ Σ weights · inputs + bias ] ──► [ Step Function ] ──► Output (0 or 1)
Input 2 ──┘
```

| Feature | Detail |
|---------|--------|
| Task | Binary Classification (AND/OR/XOR logic) |
| Learning | Perceptron Learning Rule (weight updates) |
| Activation | Step Function |
| Visualization | Decision boundary, weight history |

---

### 2. 🟢 MLP — Multi-Layer Perceptron

The classic deep learning building block — multiple layers of neurons with non-linear activations.

```
Input Layer      Hidden Layer(s)     Output Layer
   [ x1 ]  ──►  [ n1 ] [ n2 ]  ──►  [ y1 ]
   [ x2 ]  ──►  [ n3 ] [ n4 ]  ──►  [ y2 ]
   [ x3 ]  ──►  [ n5 ] [ n6 ]
```

| Feature | Detail |
|---------|--------|
| Task | Multi-class classification |
| Learning | Backpropagation + Adam optimizer |
| Activation | ReLU (hidden), Softmax (output) |
| Visualization | Loss curve, accuracy, layer activations |

---

### 3. 🔴 CNN — Convolutional Neural Network

Specialized for image data. Learns spatial features using sliding filters.

```
Input Image      Convolution      Feature Maps     Pooling      Prediction
 (32×32×3)   ──► [Filter 1]  ──►  (30×30×N)  ──►  (15×15)  ──►  Cat/Dog
             ──► [Filter 2]
             ──► [Filter N]
```

| Feature | Detail |
|---------|--------|
| Task | Cat vs Dog classification (CIFAR-10) |
| Dataset | CIFAR-10 — 600 real images (300 cats + 300 dogs) |
| Layers | Conv2D → MaxPool → Dropout → Dense |
| Visualization | Feature maps, learned filters, confidence scores |

> ⏱️ **First run is slow** — CIFAR-10 dataset loads and caches. Subsequent runs are faster.

---

### 4. 🟡 LSTM — Long Short-Term Memory

Recurrent network designed to learn from sequential/time-series data.

```
Time Step 1    Time Step 2    Time Step 3    Prediction
  [ x₁ ]  ──►  [ x₂ ]  ──►  [ x₃ ]  ──►  [ x₄ = ? ]
     │             │             │
   Memory ──────► Memory ──────► Memory
  (Cell State carries information across time)
```

```
Each LSTM Cell:
  ┌────────────────────────────────┐
  │  Forget Gate: "What to erase" │
  │  Input Gate:  "What to learn" │
  │  Output Gate: "What to show"  │
  └────────────────────────────────┘
```

| Feature | Detail |
|---------|--------|
| Task | Number sequence prediction / Text next-word prediction |
| Modes | `number` (time-series) or `text` (word sequences) |
| Visualization | Loss curve, hidden state heatmap |

> ⏱️ **Slow for small sequences** — minimum 200 epochs enforced to ensure convergence.

---

### 5. 🟠 RNN — Recurrent Neural Network

The simpler predecessor to LSTM — processes sequences but lacks long-term memory.

```
   x₁ ──► [h₁] ──► x₂ ──► [h₂] ──► x₃ ──► [h₃] ──► Output
            │               │               │
           h₀              h₁              h₂
         (hidden state passed forward)
```

| Feature | Detail |
|---------|--------|
| Task | Sequence prediction |
| Limitation | Suffers from vanishing gradient on long sequences |
| Visualization | Hidden state evolution, loss per epoch |

---

### 6. 🟣 Hopfield Network — Associative Memory

A recurrent network that acts as a content-addressable memory — stores patterns and recalls them from noisy inputs.

```
Stored Pattern:       Noisy Input:         Recalled Pattern:
  ■ ■ □ □              ■ □ □ □                ■ ■ □ □
  □ □ ■ ■    ──────►   □ □ ■ □    ──────►    □ □ ■ ■
  ■ □ ■ □              ■ □ □ □                ■ □ □ □
  □ ■ □ ■              □ ■ □ ■                □ ■ □ ■
     (Stored)            (Corrupted)            (Recovered!)
```

| Feature | Detail |
|---------|--------|
| Task | Pattern storage and recall |
| Learning | Hebbian Learning Rule |
| Update | Asynchronous updates with convergence detection |
| Encoding | Bipolar (−1 / +1) for stability |

---

## 📁 Project Structure

```
nn_project/
│
├── 📂 backend/                  # FastAPI Python Backend
│   ├── main.py                  # App entry point, CORS, router registration
│   ├── requirements.txt         # Python dependencies
│   ├── .venv/                   # Virtual environment
│   │
│   └── 📂 routes/               # One file per neural network model
│       ├── perceptron.py        # Perceptron training & decision boundary
│       ├── mlp.py               # Multi-Layer Perceptron
│       ├── cnn.py               # CNN with CIFAR-10 dataset
│       ├── lstm.py              # LSTM for sequence prediction
│       ├── rnn.py               # Simple RNN
│       └── hopfield.py          # Hopfield associative memory
│
└── 📂 vite-project/             # React + Vite Frontend
    ├── index.html               # App shell
    ├── vite.config.js           # Vite configuration
    ├── package.json             # Node dependencies
    │
    └── 📂 src/                  # React source code
        ├── App.jsx              # Root component & routing
        └── ...                  # Components per model
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite 8 | UI framework & dev server |
| **Backend** | FastAPI 0.115 | REST API framework |
| **Server** | Uvicorn | ASGI server with hot-reload |
| **Deep Learning** | TensorFlow-CPU 2.18 | Model training (CNN, LSTM, RNN, MLP) |
| **Numerics** | NumPy 1.26 | Array operations, Hopfield, Perceptron |
| **ML Utilities** | Scikit-learn 1.5 | Data scaling (MinMaxScaler) |
| **Validation** | Pydantic v2 | Request body parsing & validation |

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.12** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)

---

### ⚙️ Backend Setup

```powershell
# Step 1: Navigate to backend
cd d:\Downloads\LearnoBox\learnobox\nn_project\backend

# Step 2: Create virtual environment (first time only)
python -m venv .venv

# Step 3: Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Step 4: Install dependencies (first time only)
pip install -r requirements.txt

# Step 5: Start the server
python -m uvicorn main:app --reload --port 8000
```

✅ Backend running at: **http://localhost:8000**
📚 Interactive API docs: **http://localhost:8000/docs**

---

### 🎨 Frontend Setup

Open a **new terminal**:

```powershell
# Step 1: Navigate to frontend
cd d:\Downloads\LearnoBox\learnobox\nn_project\vite-project

# Step 2: Install Node dependencies (first time only)
npm install

# Step 3: Start dev server
npm run dev
```

✅ Frontend running at: **http://localhost:5173**

---

### 🔁 Quick Start (Already Set Up)

```powershell
# Terminal 1 — Backend
cd "d:\Downloads\LearnoBox\learnobox\nn_project\backend"
python -m uvicorn main:app --reload --port 8000

# Terminal 2 — Frontend
cd "d:\Downloads\LearnoBox\learnobox\nn_project\vite-project"
npm run dev
```

---

## 📡 API Reference

All endpoints accept `POST` requests with JSON bodies.

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/perceptron/train` | POST | Train perceptron, return weights & decision boundary |
| `/mlp/train` | POST | Train MLP, return loss/accuracy history |
| `/cnn/train` | POST | Train CNN on CIFAR-10, return feature maps |
| `/lstm/train` | POST | Train LSTM, return predictions & hidden states |
| `/rnn/train` | POST | Train RNN, return sequence predictions |
| `/hopfield/train` | POST | Store & recall patterns |
| `/docs` | GET | Interactive Swagger UI for all endpoints |

---

## ⚡ Performance Notes

| Model | Typical Time | Reason |
|-------|-------------|--------|
| Perceptron | < 1s | Pure NumPy, no TF overhead |
| Hopfield | < 1s | Matrix operations only |
| MLP | 2–5s | Small dataset, lightweight Keras model |
| RNN | 3–8s | Sequential training with TensorFlow |
| **LSTM** | **10–30s** | Min 200 epochs enforced + double inference for hidden states |
| **CNN** | **15–45s** | CIFAR-10 load (cached after first) + 600-image training |

> 💡 **Tip:** CNN is fast after the first request because the dataset is cached in memory. LSTM is slow because of enforced minimum epochs for numerical convergence on small sequences.

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "Add: your feature"`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open a Pull Request**

### Ideas for contributions
- 🌐 Add Transformer / Attention model
- 📱 Make UI mobile responsive
- 💾 Add model saving/loading
- 📈 Add live training progress (WebSocket streaming)
- 🌍 Add more datasets for CNN

---

## 📄 License

This project is licensed under the **MIT License** — free to use, modify, and distribute.

---

<div align="center">

Built with ❤️ for neural network learners everywhere

**[⬆ Back to Top](#-learnobox--neural-network-learning-platform)**

</div>
