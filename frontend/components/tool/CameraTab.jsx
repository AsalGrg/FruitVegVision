'use client'
import clsx from 'clsx'
import { Camera, Square } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useTool from '../../hooks/useToolContext'


const WS_URL = process.env.NEXT_PUBLIC_API_URL+"/ws/detect";
const FRAME_INTERVAL_MS = 100;          // 10 FPS to backend
const JPEG_QUALITY = 0.6;

const CameraTab = () => {

    const canvasRef = useRef(null);
    const captureCanvasRef = useRef(null);
    const containerRef = useRef(null);
    const wsRef = useRef(null);
    const reconnectWebsocket = useRef(false)
    const detectionsRef = useRef([])
    const reconnectTimerRef = useRef(null)
    const captureInterval = useRef(null)
    const animRef = useRef(0)

    const [cameraError, setCameraError] = useState(null)
    const { setLiveResults, liveResults, tab, cameraActive, setCameraActive, streamRef, stopCameraRef } = useTool();

    const videoElemRef = useRef(null)

    // to connect to the websocket
    const connect = useCallback(() => {
        const ws = new WebSocket(WS_URL)
        wsRef.current = ws

        ws.onopen = () => {
            setCameraError(null)
        }

        ws.onclose = () => {
            wsRef.current = null

            // only retry if the user hasn't explicitly closed the camera
            if (reconnectWebsocket.current) {
                reconnectTimerRef.current = setTimeout(connect, 2500)
            }
        }

        ws.onerror = () => console.log('Error Connecting to WebSocket')

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data)
                if (Array.isArray(data.detections)) {
                    detectionsRef.current = data.detections
                    setLiveResults(data.detections)
                    // setDetectionCount(data.detections.length)
                    // if (typeof data.demo_mode === 'boolean') setDemoMode(data.demo_mode)
                }
            } catch (e) {
                console.error('Bad JSON:', e)
            }
        }
    }, [])


    const startCamera = useCallback(async () => {
        setCameraError(null)
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            streamRef.current = stream
            if (videoElemRef.current) videoElemRef.current.srcObject = stream
            setCameraActive(true)
        } catch {
            setCameraError("Camera access denied. Allow camera permissions and try again.")
        }
        reconnectWebsocket.current = true
        connect()
    }, [connect]
    )

    // for stopping camera, on switiching tabs, or click kill btn
    const stopCamera = useCallback(() => {
        reconnectWebsocket.current = false
        clearTimeout(reconnectTimerRef.current)

        // 2. Close WebSocket
        wsRef.current?.close()

        // 3. Stop camera hardware
        streamRef.current?.getTracks().forEach(t => t.stop())
        streamRef.current = null
        if (videoElemRef.current) videoElemRef.current.srcObject = null


        detectionsRef.current = []
        setCameraActive(false)
        setLiveResults([])
    }, []
    )

    // This is for switchTab function in ToolsContext, as stopCamera is in child.
    useEffect(() => {
        stopCameraRef.current = stopCamera
        return () => {
            stopCameraRef.current = null   // clean up when CameraTab unmounts
        }
    }, [stopCamera])

    // ----------------------------------------------------------------
    // 3. Frame capture loop (throttled)
    // ----------------------------------------------------------------
    const captureAndSend = useCallback(() => {
        const video = videoElemRef.current;
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

    }, []);

    // resending
    useEffect(() => {
        captureInterval.current = setInterval(captureAndSend, FRAME_INTERVAL_MS);
        return () => {
            if (captureInterval.current) clearInterval(captureInterval.current);
        };
    }, [captureAndSend]);

    // ----------------------------------------------------------------
    // 4. Drawing loop (requestAnimationFrame)
    // ----------------------------------------------------------------
    useEffect(() => {
        function draw() {
            const canvas = canvasRef.current;
            const video = videoElemRef.current;
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

    return (
        <>
            {tab === "camera" && (
                <div className="relative min-h-[480px] bg-black flex items-center justify-center">
                    <video
                        ref={videoElemRef} autoPlay playsInline muted
                        className={clsx("w-full max-h-[480px] object-cover relative", cameraActive ? "block" : "hidden")}
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

                    <canvas ref={captureCanvasRef} style={{ display: 'none' }} />


                    {!cameraActive && (
                        <div className="text-center px-12 py-14">
                            <div className="w-20 h-20 rounded-full bg-warm-white/32 border border-warm-white/50 flex items-center justify-center mx-auto mb-6">
                                <Camera size={36} className="text-warm-white" />
                            </div>
                            <p className="text-white font-bold text-lg mb-2">Camera ready</p>
                            <p className="text-zinc-500 text-sm leading-relaxed mb-7">
                                Point your camera at any food item.<br />Detections refresh every 2.5 seconds.
                            </p>
                            {cameraError && (
                                <p className="text-red-400 text-[13px] bg-red-500/10 px-4 py-2 rounded-lg mb-5">
                                    {cameraError}
                                </p>
                            )}
                            <button
                                onClick={startCamera}
                                className="bg-white text-brand-dark font-bold px-9 py-3.5 rounded-xl flex items-center gap-2.5 mx-auto hover:opacity-90 transition-opacity"
                            >
                                <Camera size={16} /> Start Camera
                            </button>
                        </div>
                    )}

                    {cameraActive && (
                        <>
                            {/* LIVE badge */}
                            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/65 backdrop-blur-sm rounded-lg px-3.5 py-1.5">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-white text-xs font-bold tracking-widest">LIVE</span>
                            </div>
                            {/* FPS badge */}
                            <div className="absolute top-4 left-24 bg-black/65 backdrop-blur-sm rounded-lg px-3.5 py-1.5">
                                <span className="text-brand-cyan text-xs font-bold">~30 FPS</span>
                            </div>
                            <button
                                onClick={stopCamera}
                                className="absolute top-4 right-4 flex items-center gap-1.5 bg-red-500/75 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-red-500 transition-colors"
                            >
                                <Square size={11} fill="white" /> Stop
                            </button>
                        </>
                    )}
                </div>
            )}
        </>
    )
}

export default CameraTab