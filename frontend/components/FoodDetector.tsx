'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ------------------------------------------------------------------
// Config
// ------------------------------------------------------------------
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/detect';
const FRAME_INTERVAL_MS = 100;          // 10 FPS to backend
const JPEG_QUALITY = 0.6;               // balance bandwidth vs quality

// 53 classes – same order as backend so colors match exactly
const CLASSES = [
  'tomato_raw', 'apple_raw', 'orange_raw', 'potato_raw', 'strawberry_raw',
  'mango_raw', 'carrot_raw', 'egg', 'banana', 'pear_raw',
  'watermelon_raw', 'lemon_raw', 'cucumber_raw', 'cabbage', 'pineapple_raw',
  'watermelon', 'broccoli', 'cucumber', 'tomato', 'lemon',
  'banana_group', 'onion_raw', 'broccoli_group', 'grapes_raw', 'strawberry',
  'carrot_group', 'cabbage_group', 'orange', 'cucumber_group', 'potato_group',
  'carrot', 'potato', 'strawberry_group', 'tomato_group', 'cauliflower',
  'bell_pepper', 'mango_group', 'grapes', 'pineapple', 'watermelon_group',
  'orange_group', 'lemon_group', 'apple', 'mango', 'banana_slice',
  'pineapple_group', 'apple_group', 'onion_group', 'pear', 'onion',
  'pear_group', 'bell_pepper_group', 'cauliflower_group',
];

const CALORIES: Record<string, number> = {
  tomato_raw: 18, apple_raw: 52, orange_raw: 47, potato_raw: 77,
  strawberry_raw: 32, mango_raw: 60, carrot_raw: 41, egg: 155,
  banana: 89, pear_raw: 57, watermelon_raw: 30, lemon_raw: 29,
  cucumber_raw: 15, cabbage: 25, pineapple_raw: 50, watermelon: 30,
  broccoli: 34, cucumber: 15, tomato: 18, lemon: 29,
  banana_group: 178, onion_raw: 40, broccoli_group: 102, grapes_raw: 69,
  strawberry: 32, carrot_group: 82, cabbage_group: 75, orange: 47,
  cucumber_group: 45, potato_group: 154, carrot: 41, potato: 77,
  strawberry_group: 96, tomato_group: 54, cauliflower: 25, bell_pepper: 31,
  mango_group: 180, grapes: 69, pineapple: 50, watermelon_group: 90,
  orange_group: 94, lemon_group: 58, apple: 52, mango: 60,
  banana_slice: 89, pineapple_group: 100, apple_group: 104, onion_group: 80,
  pear: 57, onion: 40, pear_group: 114, bell_pepper_group: 62,
  cauliflower_group: 75,
};

function generateColors(): Record<string, string> {
  const colors: Record<string, string> = {};
  const goldenRatio = 0.618033988749895;
  CLASSES.forEach((cls, i) => {
    const h = Math.round(((i * goldenRatio) % 1.0) * 360);
    colors[cls] = `hsl(${h}, 85%, 55%)`;
  });
  return colors;
}

const COLORS = generateColors();

// ------------------------------------------------------------------
// Types
// ------------------------------------------------------------------
interface Detection {
  class: string;
  confidence: number;
  bbox: [number, number, number, number];
  calories: number;
  color?: string;
}

// ------------------------------------------------------------------
// Component
// ------------------------------------------------------------------
export default function FoodDetector() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [fps, setFps] = useState(0);
  const [demoMode, setDemoMode] = useState(false);
  const [detectionCount, setDetectionCount] = useState(0);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const detectionsRef = useRef<Detection[]>([]);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const animRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ----------------------------------------------------------------
  // 1. Camera
  // ----------------------------------------------------------------
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment',
          },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
        setCameraError('Camera access denied or unavailable. Check permissions.');
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ----------------------------------------------------------------
  // 2. WebSocket (with auto-reconnect)
  // ----------------------------------------------------------------
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    function connect() {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;
      setStatus('connecting');

      ws.onopen = () => {
        setStatus('connected');
        setCameraError(null);
      };

      ws.onclose = () => {
        setStatus('disconnected');
        wsRef.current = null;
        reconnectTimer = setTimeout(connect, 2500);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setStatus('disconnected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            console.warn('Server error:', data.error);
            return;
          }
          if (Array.isArray(data.detections)) {
            detectionsRef.current = data.detections;
            setDetectionCount(data.detections.length);
            if (typeof data.demo_mode === 'boolean') {
              setDemoMode(data.demo_mode);
            }
          }
        } catch (e) {
          console.error('Bad JSON from server:', e);
        }
      };
    }

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, []);

  // ----------------------------------------------------------------
  // 3. Frame capture loop (throttled)
  // ----------------------------------------------------------------
  const captureAndSend = useCallback(() => {
    const video = videoRef.current;
    const captureCanvas = captureCanvasRef.current;
    const ws = wsRef.current;

    if (!video || !captureCanvas || !ws || ws.readyState !== WebSocket.OPEN) return;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) return;
    if (video.videoWidth === 0 || video.videoHeight === 0) return;

    // Resize capture canvas only when video dimensions change
    if (captureCanvas.width !== video.videoWidth || captureCanvas.height !== video.videoHeight) {
      captureCanvas.width = video.videoWidth;
      captureCanvas.height = video.videoHeight;
    }

    const ctx = captureCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    // toDataURL is synchronous; JPEG quality keeps payload small (~50-120 KB)
    const dataUrl = captureCanvas.toDataURL('image/jpeg', JPEG_QUALITY);
    ws.send(dataUrl);

    // FPS counter
    frameCountRef.current++;
    const now = Date.now();
    if (now - lastTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(captureAndSend, FRAME_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [captureAndSend]);

  // ----------------------------------------------------------------
  // 4. Drawing loop (requestAnimationFrame)
  // ----------------------------------------------------------------
  useEffect(() => {
    function draw() {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Match overlay canvas to the *displayed* video size
      const displayW = video.clientWidth;
      const displayH = video.clientHeight;

      if (canvas.width !== displayW || canvas.height !== displayH) {
        canvas.width = displayW;
        canvas.height = displayH;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const naturalW = video.videoWidth || 1;
      const naturalH = video.videoHeight || 1;
      const scaleX = displayW / naturalW;
      const scaleY = displayH / naturalH;

      const dets = detectionsRef.current;

      dets.forEach((det) => {
        const [x1, y1, x2, y2] = det.bbox;
        const cls = det.class;
        const color = det.color || COLORS[cls] || '#00ff00';
        const cal = det.calories ?? CALORIES[cls] ?? 0;
        const conf = det.confidence;

        const sx = x1 * scaleX;
        const sy = y1 * scaleY;
        const sw = (x2 - x1) * scaleX;
        const sh = (y2 - y1) * scaleY;

        // Bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(sx, sy, sw, sh);

        // Label text
        const label = `${cls}  •  ${cal} kcal  •  ${(conf * 100).toFixed(0)}%`;
        ctx.font = 'bold 13px system-ui, -apple-system, Segoe UI, sans-serif';
        const metrics = ctx.measureText(label);
        const pad = 6;
        const lh = 20;
        const lw = metrics.width + pad * 2;

        // Label background (filled rectangle above the box)
        ctx.fillStyle = color;
        ctx.fillRect(sx, Math.max(sy - lh, 0), lw, lh);

        // Text
        ctx.fillStyle = '#ffffff';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(label, sx + pad, Math.max(sy - 4, 16));
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  const statusColor =
    status === 'connected' ? '#22c55e' : status === 'connecting' ? '#eab308' : '#ef4444';

  return (
    <div>
      {cameraError && (
        <div
          style={{
            background: '#dc2626',
            padding: '12px 16px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
          }}
        >
          {cameraError}
        </div>
      )}

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <span
          style={{
            background: statusColor,
            color: '#000',
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#000' }} />
          {status === 'connected' ? 'Live' : status === 'connecting' ? 'Connecting…' : 'Offline'}
        </span>

        <span style={{ background: '#27272a', padding: '6px 14px', borderRadius: 999, fontSize: 13 }}>
          FPS: {fps}
        </span>
        <span style={{ background: '#27272a', padding: '6px 14px', borderRadius: 999, fontSize: 13 }}>
          Objects: {detectionCount}
        </span>
        {demoMode && (
          <span
            style={{
              background: '#f97316',
              color: '#000',
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            DEMO MODE
          </span>
        )}
      </div>

      {/* Video + overlay */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          display: 'inline-block',
          maxWidth: '100%',
          background: '#000',
          borderRadius: 12,
          overflow: 'hidden',
          border: '2px solid #27272a',
          lineHeight: 0,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />
        {/* Hidden capture canvas (never shown) */}
        <canvas ref={captureCanvasRef} style={{ display: 'none' }} />
      </div>

      <p style={{ marginTop: 14, fontSize: 13, color: '#a1a1aa' }}>
        Backend: {WS_URL} ・ Point your camera at fruits / vegetables. Bounding boxes update in real time.
      </p>
    </div>
  );
}
