'use client'
import React from 'react'
import useTool from '../../hooks/useToolContext'
import { Zap } from 'lucide-react';

const EmptyState = () => {

    const {tab}= useTool();
    const messages = {
        photo: "Upload an image and hit Analyze to see results.",
        video: "Upload a video file to begin frame detection.",
        camera: "Start your camera to begin live detection.",
    }
    return (
        <div className="flex flex-col items-center text-center py-14 px-6">
            <div className="w-12 h-12 rounded-xl bg-brand-border flex items-center justify-center mb-4">
                <Zap size={20} className="text-brand-muted" />
            </div>
            <p className="font-bold text-brand-dark mb-1.5">No detections yet</p>
            <p className="text-brand-muted text-sm leading-relaxed max-w-[200px]">
                {messages[tab]}
            </p>
        </div>
    )
}

export default EmptyState