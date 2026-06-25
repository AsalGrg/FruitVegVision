import clsx from 'clsx'
import React from 'react'


function DropZone({ onDrag, onDrop, onClick, isDragging, accept, icon: Icon, iconColor, title, hint, btnLabel }) {
    return (
        <div
            className={clsx(
                "m-6 rounded-2xl border-2 border-dashed p-16 text-center cursor-pointer transition-all duration-200",
                isDragging
                    ? "border-brand-cyan bg-brand-cyan/5"
                    : "border-brand-border bg-warm-white hover:border-brand-muted"
            )}
            onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag}
            onDrop={onDrop} onClick={onClick}
        >
            <div className={clsx(
                "w-14 h-14 rounded-[18px] flex items-center justify-center mx-auto mb-5",
                iconColor === "cyan" ? "bg-brand-cyan/10" : "bg-brand-yellow/10"
            )}>
                <Icon size={26} className={iconColor === "cyan" ? "text-brand-cyan" : "text-brand-yellow"} />
            </div>
            <p className="font-bold text-lg text-brand-dark mb-2">{title}</p>
            <p className="text-brand-muted text-sm mb-6">{hint}</p>
            <span className="bg-black text-white px-7 py-2.5 rounded-xl text-sm font-semibold">
                {btnLabel}
            </span>
        </div>
    )
}


export default DropZone