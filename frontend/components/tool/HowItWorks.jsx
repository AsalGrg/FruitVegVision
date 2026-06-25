import React from 'react'

const HowItWorks = () => {
    return (

        <div className="bg-black rounded-sm p-8 space-y-4" >
            <p className="sub-heading">
                How It Works
            </p>
            {
                [
                    ["01", "Choose your input", "Photo, video file, or live camera."],
                    ["02", "Model runs inference", "YOLOv8 scans every region in frame."],
                    ["03", "Results surface", "Class, confidence score, and calories."],
                ].map(([num, title, desc]) => (
                    <div key={num} className="flex gap-4 mb-4 last:mb-0 items-center">
                        <span className="text-green-400/72 font-semibold pt-0.5 min-w-[20px]">{num}</span>
                        <div className='space-y-1'>
                            <p className="text-white opacity-100!">{title}</p>
                            <p className="text-white/72 text-sm ">{desc}</p>
                        </div>
                    </div>
                ))
            }
        </div >
    )
}


export default HowItWorks