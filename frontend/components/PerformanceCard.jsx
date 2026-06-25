import React from 'react'

const PerformanceCard = ({title, number}) => {
    return (
        <div className='bg-linear-to-tr from-[#e9f6e7] from-50% to-[#def1db] 
        aspect-square p-4 backdrop-blur-2xl shadow-xs rounded-sm border border-gray-300 flex flex-col items-center justify-center space-y-2'>
            <p className='text-md text-black/80 font-semibold'>{title}</p>
            <p className='sub-heading font-normal text-black!'>{number}</p>
        </div>
    )
}

export default PerformanceCard