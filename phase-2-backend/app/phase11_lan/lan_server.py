from fastapi import APIRouter
import socket
import os

router = APIRouter()


def get_local_ip() -> str:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"


@router.get("/lan/info")
async def get_lan_info():
    ip = get_local_ip()
    return {
        "local_ip": ip,
        "backend_url": f"http://{ip}:8000",
        "frontend_url": f"http://{ip}:5173",
        "lan_mode": ip != "127.0.0.1",
    }