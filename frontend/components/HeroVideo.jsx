import React from 'react'

const HeroVideo = () => {
    return (

        <div className='w-[min(100%,800)]'>

            <video
                controls
                autoPlay
                muted
                preload="auto"
                playsInline
                loop
                src={'/hero_video.mp4'}
                className='aspect-video rounded-md'
            >HeroVideo</video>
        </div>
    )
}

export default HeroVideo