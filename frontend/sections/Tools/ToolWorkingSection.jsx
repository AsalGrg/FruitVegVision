import React from 'react'
import Tabs from '../../components/tool/Tabs'
import PhotoTab from '../../components/tool/PhotoTab'
import VideoTab from '../../components/tool/VideoTab'
import CameraTab from '../../components/tool/CameraTab'
import ResultPanel from '../../components/tool/ResultPanel'
import HowItWorks from '../../components/tool/HowItWorks'

const ToolWorkingSection = () => {

    
    return (
        <section className='max-w-[min(1200px,100%)] mx-auto p-8'>
            <Tabs />

            <div className="grid md:grid-cols-[1fr_340px] gap-6 items-start">
                <div className="bg-brand-surface border border-brand-border rounded-lg overflow-hidden">
                    <PhotoTab />
                    <VideoTab/>
                    <CameraTab/>
                </div>

                 <div className="flex flex-col gap-4">
                    <ResultPanel/>
                    <HowItWorks/>
                 </div>
            </div>
        </section>
    )
}

export default ToolWorkingSection