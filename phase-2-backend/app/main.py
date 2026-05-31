from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, upload
from phase4_chat import chat as chat_route
from phase5_charts import charts as charts_route

app = FastAPI(
    title="Vizora API",
    description="Fully local AI-powered data visualization backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(upload.router)
app.include_router(chat_route.router)
app.include_router(charts_route.router)


@app.get("/")
def root():
    return {"message": "Vizora API is running. Visit /docs for API documentation."}