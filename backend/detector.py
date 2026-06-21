"""Detector wrapper: real YOLO inference + deterministic demo fallback."""
import os
import random
from typing import List, Dict, Any

import numpy as np

from config import CLASSES, CALORIES, COLORS, MODEL_PATH

# Optional ultralytics import so the server starts even without it installed
try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except Exception:
    ULTRALYTICS_AVAILABLE = False


class Detector:
    """Loads a YOLO model if available; otherwise runs a demo mode
    that draws random boxes so the UI can be tested immediately."""

    def __init__(self):
        self.model = None          # type: YOLO | None
        self.demo_mode = True
        self._load()

    def _load(self) -> None:
        if not ULTRALYTICS_AVAILABLE:
            print("[Detector] Ultralytics not installed → DEMO mode")
            return

        if not os.path.exists(MODEL_PATH):
            print(f"[Detector] {MODEL_PATH} not found → DEMO mode")
            return

        try:
            self.model = YOLO(MODEL_PATH)
            self.demo_mode = False
            print(f"[Detector] Loaded YOLO model: {MODEL_PATH}")
            print(f"[Detector] Classes: {self.model.names}")
        except Exception as exc:
            print(f"[Detector] Failed to load model: {exc} → DEMO mode")

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def predict(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        if self.demo_mode:
            return self._demo_predict(frame)
        return self._real_predict(frame)

    # ------------------------------------------------------------------
    # Real inference
    # ------------------------------------------------------------------
    def _real_predict(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        results = self.model.predict(frame, verbose=False)[0]
        detections: List[Dict[str, Any]] = []
        for box in results.boxes:
            cls_id = int(box.cls)
            cls_name = self.model.names.get(cls_id, f"class_{cls_id}")
            detections.append({
                "class": cls_name,
                "confidence": round(float(box.conf), 3),
                "bbox": [int(x) for x in box.xyxy[0].tolist()],   # [x1, y1, x2, y2]
                "calories": CALORIES.get(cls_name, 0),
                "color": COLORS.get(cls_name, "#FF0000"),
            })
        return detections

    # ------------------------------------------------------------------
    # Demo inference (deterministic enough to look alive)
    # ------------------------------------------------------------------
    def _demo_predict(self, frame: np.ndarray) -> List[Dict[str, Any]]:
        h, w = frame.shape[:2]
        num = random.randint(1, 4)
        detections: List[Dict[str, Any]] = []
        for _ in range(num):
            cls_name = random.choice(CLASSES)
            bw = random.randint(max(40, w // 10), max(60, w // 4))
            bh = random.randint(max(40, h // 10), max(60, h // 4))
            x1 = random.randint(0, max(1, w - bw))
            y1 = random.randint(0, max(1, h - bh))
            detections.append({
                "class": cls_name,
                "confidence": round(random.uniform(0.65, 0.95), 3),
                "bbox": [x1, y1, x1 + bw, y1 + bh],
                "calories": CALORIES.get(cls_name, 0),
                "color": COLORS.get(cls_name, "#FF0000"),
            })
        return detections


# Singleton instance – loaded once when the module is imported
detector = Detector()
