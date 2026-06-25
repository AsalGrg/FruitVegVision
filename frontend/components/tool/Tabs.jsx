'use client'
import React from 'react'
import useTool from '../../hooks/useToolContext';
import { Upload,Video,Camera } from 'lucide-react';
import clsx from 'clsx';

const TABS = [
    { id: "photo", icon: Upload, label: "Photo Scan" },
    { id: "video", icon: Video, label: "Video Scan" },
    { id: "camera", icon: Camera, label: "Live Camera" },
]

const Tabs = () => {
    const { tab, switchTab } = useTool();
    return (
        <div className="flex gap-1.5 mb-8 bg-brand-surface rounded-lg p-1 w-fit">
            {TABS.map(({ id, icon: Icon, label }) => (
                <button
                    key={id}
                    onClick={() => switchTab(id)}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-semibold transition-all duration-200",
                        tab === id
                            ? "bg-black text-white shadow-sm"
                            : "text-gray-500 hover:text-black"
                    )}
                >
                    <Icon size={14} className='md:block hidden'/> {label}
                </button>
            ))}
        </div>

    )
}

export default Tabs