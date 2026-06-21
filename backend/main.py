"""FastAPI backend with WebSocket real-time object detection."""
import asyncio
import base64
import logging
import os
from concurrent.futures import ThreadPoolExecutor
from contextlib import asynccontextmanager
from typing import Any, Dict, List

import cv2
import numpy as np
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from config import CALORIES, CLASSES, COLORS
from detector import detector

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger(__name__)

# Thread pool for CPU/GPU-bound inference so the event loop never blocks
executor = ThreadPoolExecutor(max_workers=1)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Server starting — demo_mode={detector.demo_mode}, classes={len(CLASSES)}")
    yield
    logger.info("Server shutting down")
    executor.shutdown(wait=True)


app = FastAPI(title="Real-time Food Detection API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# REST helpers
# ------------------------------------------------------------------
@app.get("/")
def root() -> Dict[str, Any]:
    return {
        "status": "running",
        "demo_mode": detector.demo_mode,
        "model_path": os.environ.get("MODEL_PATH", "best.pt"),
        "classes_count": len(CLASSES),
    }


@app.get("/classes")
def get_classes() -> Dict[str, Any]:
    return {"classes": CLASSES, "calories": CALORIES, "colors": COLORS}


# ------------------------------------------------------------------
# WebSocket – real-time detection loop
# ------------------------------------------------------------------
@app.websocket("/ws/detect")
async def websocket_detect(websocket: WebSocket):
    await websocket.accept()
    client = websocket.client.host if websocket.client else "unknown"
    logger.info(f"WS connect  {client}")

    is_processing = False

    try:
        while True:
            message = await websocket.receive_text()

            # Drop frames if the model is still busy (keeps latency low)
            if is_processing:
                continue

            is_processing = True
            try:
                # Parse data:image/jpeg;base64,<bytes>
                if "," in message:
                    encoded = message.split(",", 1)[1]
                else:
                    encoded = message

                img_bytes = base64.b64decode(encoded)
                nparr = np.frombuffer(img_bytes, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                if frame is None:
                    await websocket.send_json({"error": "Failed to decode image"})
                    continue

                # Run inference in thread pool so asyncio stays responsive
                loop = asyncio.get_event_loop()
                detections: List[Dict[str, Any]] = await loop.run_in_executor(
                    executor, detector.predict, frame
                )

                await websocket.send_json({
                    "detections": detections,
                    "demo_mode": detector.demo_mode,
                    "timestamp": loop.time(),
                })

            except Exception as exc:
                logger.error(f"Processing error for {client}: {exc}")
                await websocket.send_json({"error": str(exc)})
            finally:
                is_processing = False

    except WebSocketDisconnect:
        logger.info(f"WS disconnect {client}")
    except Exception as exc:
        logger.error(f"WS fatal error for {client}: {exc}")
        await websocket.close()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
