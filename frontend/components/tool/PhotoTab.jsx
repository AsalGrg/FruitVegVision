'use client'
import { Upload, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react'
import useTool from '../../hooks/useToolContext';
import AnalyzeButton from './AnalyzeButton';
import DropZone from './DropZone';
import { predictPhotoService } from '../../services/predictPhotoService';


const DEMO_RESULTS = [
    { class: "Apple", confidence: 0.94, calories: 95, color: "bg-red-500" },
    { class: "Banana", confidence: 0.87, calories: 105, color: "bg-amber-400" },
    { class: "Broccoli", confidence: 0.91, calories: 31, color: "bg-green-500" },
]



const PhotoTab = () => {

    const fileImgRef = useRef(null)
    const canvasRef = useRef(null)
    const photoRef = useRef(null)
    const animRef = useRef(0)
    const detectionRef = useRef([])

    const [photoSrc, setPhotoSrc] = useState(null)
    const [photoFile, setPhotoFile] = useState(null)

    const { tab, setPhotoResults, photoResults, onDrag, setIsAnalyzing, isAnalyzing, isDragging, setIsDragging } = useTool();

    const processImage = file => {
        if (!file?.type.startsWith("image/")) return
        setPhotoSrc(URL.createObjectURL(file))
        setPhotoFile(file)
        setPhotoResults([])
        detectionRef.current = []
    }


    const draw = useCallback(
        () => {
            const canvas = canvasRef.current;
            const photo = photoRef.current;
            if (!canvas || !photo) {
                animRef.current = requestAnimationFrame(draw);
                return;
            }

            // Match overlay canvas to the *displayed* video size
            const displayW = photo.clientWidth;
            const displayH = photo.clientHeight;

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

            const naturalW = photo.naturalWidth || 1;
            const naturalH = photo.naturalHeight || 1;
            // const scaleX = displayW / naturalW;
            // const scaleY = displayH / naturalH;
            const scale = Math.min(displayW / naturalW, displayH / naturalH);

            const offsetX = (displayW - naturalW * scale) / 2;
            const offsetY = (displayH - naturalH * scale) / 2;

            const dets = detectionRef.current;

            dets.forEach((det) => {
                const [x1, y1, x2, y2] = det.bbox;
                const cls = det.class;
                const color = det.color || COLORS[cls] || '#00ff00';
                const cal = det.calories ?? CALORIES[cls] ?? 0;
                const conf = det.confidence;

                const sx = x1 * scale + offsetX;
                const sy = y1 * scale + offsetY;
                const sw = (x2 - x1) * scale;
                const sh = (y2 - y1) * scale;

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
    )

    // Main Function for triggering generate results
    const handleAnalyzePhoto = useCallback(async () => {
        setIsAnalyzing(true)
        const file = photoFile
        try {
            const data = await predictPhotoService(file)
            detectionRef.current = data.data.detections
            setPhotoResults(data.data.detections)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
        setIsAnalyzing(false)
        draw()
    }, [draw]
    )

    return (
        <>
            {tab === "photo" && (
                !photoSrc ? (
                    <>
                        <DropZone
                            onDrag={onDrag}
                            onDrop={e => { e.preventDefault(); setIsDragging(false); processImage(e.dataTransfer.files[0]) }}
                            onClick={() => fileImgRef.current?.click()}
                            isDragging={isDragging}
                            icon={Upload} iconColor="cyan"
                            title="Drop your image here"
                            hint="JPG, PNG, or WEBP — up to 10 MB"
                            btnLabel="Choose File"
                        />
                        <input ref={fileImgRef} type="file" accept="image/*" className="hidden"
                            onChange={e => processImage(e.target.files[0])} 
                            />
                    </>
                ) : (
                    <>
                        <div className="relative">
                            <img src={photoSrc} alt="Upload preview"
                                className="w-full block max-h-[440px] object-contain bg-zinc-900"
                                ref={photoRef}
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
                            <button
                                onClick={() => { setPhotoSrc(null); setPhotoFile(null); setPhotoResults([]) }}
                                className="absolute top-3.5 right-3.5 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                            >
                                <X size={15} className="text-white" />
                            </button>
                        </div>
                        <div className="p-5">
                            <AnalyzeButton
                                isAnalyzing={isAnalyzing}
                                hasResults={photoResults.length > 0}
                                onAnalyze={handleAnalyzePhoto}
                                onReset={() => { setPhotoSrc(null); setPhotoResults([]); setPhotoFile(null) }}
                                analyzeLabel="Analyze Image"
                                resetLabel="Scan Another Image"
                            />
                        </div>
                    </>
                )
            )}
        </>

    )
}

export default PhotoTab