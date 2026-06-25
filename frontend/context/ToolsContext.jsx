'use client'
import { createContext, useCallback, useRef, useState } from "react";

export const ToolsContext = createContext();

// 2. Create a custom Provider Component
export function ToolContextProvider({ children }) {
    const [tab, setTab] = useState("photo")       // "photo" | "camera" | "video"
    const [cameraActive, setCameraActive] = useState(false)
    const [photoResults, setPhotoResults] = useState([])
    const [liveResults, setLiveResults] = useState([])
    const [videoResults, setVideoResults] = useState([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    // holds the live camera stream which is used to stop when finished
    const streamRef = useRef(null);
    const stopCameraRef = useRef(null)

    // for switching tab 
    const switchTab = (next) => {
        if (cameraActive) {
            stopCameraRef.current?.()  // ← calls whatever the child registered
        }
        setTab(next)
    }


    const onDrag = useCallback(e => {
        e.preventDefault()
        setIsDragging(e.type === "dragenter" || e.type === "dragover")
    }, [])



    return (

        <ToolsContext.Provider value={{
            tab, setTab, switchTab, cameraActive, setCameraActive,
            photoResults, setPhotoResults, isAnalyzing, setIsAnalyzing, isDragging, setIsDragging, onDrag,
            videoResults, setVideoResults, liveResults, setLiveResults, streamRef,stopCameraRef
        }}>
            {children}
        </ToolsContext.Provider>
    );
}