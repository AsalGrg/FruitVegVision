import clsx from 'clsx'
import React from 'react'

const DetectionCard = ({item, index}) => {
    return (
        <div
            className="bg-brand-bg border border-brand-border rounded-sm p-4 animate-fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                    <span className={clsx("w-2.5 h-2.5 rounded-full flex-shrink-0", item.color)} />
                    <span className="font-bold text-[15px] text-brand-dark">{item.class}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-brand-cyan/10 text-teal-600 text-xs font-bold px-2.5 py-1 rounded-md">
                        {Math.round(item.confidence * 100)}%
                    </span>
                    <span className="text-brand-muted text-xs">{item.calories} kcal</span>
                </div>
            </div>
            {/* Confidence bar */}
            <div className="h-1 bg-brand-border rounded-full overflow-hidden">
                <div
                    className="h-full bg-brand-cyan rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${item.confidence * 100}%` }}
                />
            </div>
        </div>
    )
}

export default DetectionCard