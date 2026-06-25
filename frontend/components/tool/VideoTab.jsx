'use client'
import { Upload, Video, X } from 'lucide-react';
import React, { useRef, useState } from 'react'
import useTool from '../../hooks/useToolContext';
import AnalyzeButton from './AnalyzeButton';
import DropZone from './DropZone';

const VideoTab = () => {

    const fileVidRef = useRef(null)

    const [videoSrc, setVideoSrc] = useState(null)

    const { tab, setVideoResults, videoResults, onDrag, setIsAnalyzing, isAnalyzing, isDragging, setIsDragging } = useTool();

    const processVideo = file => {
        if (!file?.type.startsWith("video/")) return
        setVideoSrc(URL.createObjectURL(file))
        setVideoResults([])
    }

    // Main Function for triggering generate results
    const handleAnalyzeVideo = async () => {
        setIsAnalyzing(true)
        await new Promise(r => setTimeout(r, 2800))
        setVideoResults(randomDetections())
        setIsAnalyzing(false)
    }


    return (
        <>
            {/* VIDEO */}
            {tab === "video" && (
                !videoSrc ? (
                    <>
                        <DropZone
                            onDrag={onDrag}
                            onDrop={e => { e.preventDefault(); setIsDragging(false); processVideo(e.dataTransfer.files[0]) }}
                            onClick={() => fileVidRef.current?.click()}
                            isDragging={isDragging}
                            icon={Video} iconColor="yellow"
                            title="Drop your video here"
                            hint="MP4, MOV, or WEBM — up to 200 MB"
                            btnLabel="Choose File"
                        />
                        <input ref={fileVidRef} type="file" accept="video/*" className="hidden"
                            onChange={e => processVideo(e.target.files[0])} />
                    </>
                ) : (
                    <>
                        <div className="relative bg-zinc-900">
                            <video src={videoSrc} controls className="w-full block max-h-[440px]" />
                            <button
                                onClick={() => { setVideoSrc(null); setVideoResults([]) }}
                                className="absolute top-3.5 right-3.5 w-9 h-9 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                            >
                                <X size={15} className="text-white" />
                            </button>
                        </div>
                        <div className="p-5">
                            <AnalyzeButton
                                isAnalyzing={isAnalyzing}
                                hasResults={videoResults.length > 0}
                                onAnalyze={handleAnalyzeVideo}
                                onReset={() => { setVideoSrc(null); setVideoResults([]) }}
                                analyzeLabel="Run Detection"
                                resetLabel="Upload Another Video"
                            />
                        </div>
                    </>
                )
            )}
        </>

    )
}

export default VideoTab