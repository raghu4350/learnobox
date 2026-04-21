from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import perceptron, lstm, cnn, mlp, hopfield, rnn

app = FastAPI(title="Learnobox Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(perceptron.router, prefix="/perceptron", tags=["Perceptron"])
app.include_router(lstm.router, prefix="/lstm", tags=["LSTM"])
app.include_router(cnn.router, prefix="/cnn", tags=["CNN"])
app.include_router(mlp.router, prefix="/mlp", tags=["MLP"])
app.include_router(hopfield.router, prefix="/hopfield", tags=["Hopfield"])
app.include_router(rnn.router, prefix="/rnn", tags=["RNN"])
