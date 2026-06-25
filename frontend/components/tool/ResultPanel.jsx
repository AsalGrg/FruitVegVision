'use client'
import React from 'react'
import useTool from '../../hooks/useToolContext'
import EmptyState from './EmptyState';
import DetectionCard from './DetectionCard'
const ResultPanel = () => {

    const { tab, isAnalyzing, photoResults, videoResults, liveResults} = useTool();

    // selecting the outcome as per tab selected
    const activeResults = tab === "photo" ? photoResults : tab === "video" ? videoResults : liveResults

    const total = activeResults.reduce((s, r) => s + r.calories, 0)
    return (
        <div className="bg-brand-surface border border-brand-border rounded-md overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
                <div>
                    <p className="font-bold text-dark mb-0.5">Detections</p>
                    <p className="text-brand-muted text-[12px]">
                        {isAnalyzing
                            ? "Scanning frame…"
                            :activeResults.length > 0
                                ? `${activeResults.length} item${activeResults.length !== 1 ? "s" : ""} found`
                                : "Waiting for scan"}
                    </p>
                </div>
                {activeResults.length > 0 && (
                    <div className="bg-brand-yellow rounded-xl px-3.5 py-1.5 text-center">
                        <p className="text-[10px] font-bold text-brand-dark tracking-wide mb-0.5">TOTAL</p>
                        <p className="text-xl font-black text-brand-dark leading-none">
                            {total}
                            <span className="text-[11px] font-medium"> kcal</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-4 min-h-[200px]">
                {isAnalyzing ? (
                    <div className="flex flex-col items-center py-14">
                        <div className="w-10 h-10 rounded-full border-2 border-brand-border border-t-brand-cyan animate-spin mb-4" />
                        <p className="text-brand-muted text-sm">Model is running…</p>
                    </div>
                ) : activeResults.length === 0 ? (
                    <EmptyState tab={tab} />
                ) : (
                    <div className="flex flex-col gap-2.5">
                        {activeResults.map((r, i) => (
                            <DetectionCard key={`${r.class}-${i}`} item={r} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ResultPanel