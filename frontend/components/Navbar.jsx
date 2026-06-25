import React from 'react'
import Buttons from './Buttons'
import Image from 'next/image'

const Navbar = () => {
    return (
        <nav className='fixed px-4 py-2 border border-slate-300 bg-warm-white rounded-sm  left-[50%] top-4 z-10 translate-x-[-50%]'>

            <div className='flex items-center gap-12'>
                <Image src={'/next.svg'} width={'48'} height={'48'} alt='logo' />
                <div className='flex gap-4 items-center'>
                    <p>Home</p>
                    <p>Classes</p>
                </div>
                <Buttons text={'Try now'} />
            </div>
        </nav>
    )
}

export default Navbar