from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import health, upload
from phase4_chat import chat as chat_route
from phase5_charts import charts as charts_route
from phase6_library import library as library_route
from phase7_dashboard import dashboard as dashboard_route
from phase8_live import live_edit as live_edit_route
from phase10_model import model_manager as model_route
from phase11_lan import lan_server as lan_route
from phase11_lan.lan_server import get_local_ip

app = FastAPI(
    title="Vizora API",
    description="Fully local AI-powered data visualization backend",
    version="1.0.0"
)

local_ip = get_local_ip()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        f"http://{local_ip}:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(upload.router)
app.include_router(chat_route.router)
app.include_router(charts_route.router)
app.include_router(library_route.router)
app.include_router(dashboard_route.router)
app.include_router(live_edit_route.router)
app.include_router(model_route.router)
app.include_router(lan_route.router)


@app.get("/")
def root():
    return {"message": "Vizora API is running. Visit /docs for API documentation."}