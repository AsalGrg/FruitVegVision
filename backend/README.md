# Backend – FastAPI Real-time Detection Server

## Quick start (demo mode – no model needed)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server starts in **demo mode** by default and generates random bounding boxes so the frontend can be tested immediately.

## Using your real YOLO model

1. Place your `best.pt` (or `last.pt`) in this folder.
2. Uncomment `ultralytics>=8.2.0` in `requirements.txt` and reinstall.
3. Set the env var if the file is named differently:
   ```bash
   export MODEL_PATH=best.pt
   uvicorn main:app --host 0.0.0.0 --port 8000
   ```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health + demo status |
| `GET /classes` | Full class list, calories, and hex colors |
| `WS /ws/detect` | WebSocket – send base64 JPEG frames, receive JSON detections |

## Architecture notes

- **ThreadPoolExecutor** isolates GPU/CPU inference from the asyncio event loop so WebSocket ping/pong and frame drops stay responsive.
- **Frame dropping** – if the model is still processing a frame when the next one arrives, the new frame is dropped. This keeps latency bounded instead of letting a queue build up.
- **CORS** is wide-open (`*`) for local development; tighten it before production.
