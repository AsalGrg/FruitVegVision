import Image from 'next/image'
import React from 'react'



const style = {
    1: 'row-span-1 col-span-1',
    2: 'row-span-2 col-span-2',
}
const TechnologyCard = ({ span = 1, src }) => {
    return (
        <div
            className={`
        ${span == 1 ? style[1] : style[2]}
        aspect-square  backdrop-blur-2xl shadow-xs rounded-lg border border-gray-200`}
        >

            <div className='p-[8%]'>
                <Image src={src} alt='tech-logo' height={100} width={100} className='object-contain bg-red w-full h-full' />
            </div>
        </div>
    )
}

export default TechnologyCard