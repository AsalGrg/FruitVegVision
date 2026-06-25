'use client'
import React, { useState } from 'react'
import Buttons from './Buttons'
import Image from 'next/image'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const Navbar = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <>
            {/* Desktop Navbar - unchanged */}
            <nav className='fixed px-4 py-2 border border-slate-300 
            bg-warm-white rounded-sm left-[50%] 
            top-4 z-10 translate-x-[-50%] hidden md:block'>
                <div className='flex items-center gap-12'>
                    <Image src={'/next.svg'} width={'48'} height={'48'} alt='logo' />
                    <div className='flex gap-4 items-center'>
                        <p>Home</p>
                        <p>Classes</p>
                    </div>
                    <Link href={'/tool'}>
                        <Buttons text={'Try now'} />
                    </Link>
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className='fixed px-4 py-2 w-full md:hidden block z-10'>
                <div className='flex justify-between items-center'>
                    <Image src={'/next.svg'} width={'64'} height={'64'} alt='logo' />
                    <button onClick={() => setIsMenuOpen(prev => !prev)}>
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`fixed top-0 left-0 h-screen w-[min(400px,75vw)] bg-warm-white z-20 
                border-r border-red-200 shadow-xl
                transform transition-transform duration-300 ease-in-out md:hidden
                ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                {/* Drawer Header */}
                <div className='px-4 py-2 border-b border-red-200'>
                    <Image src={'/next.svg'} width={'64'} height={'64'} alt='logo' />
                </div>

                {/* Drawer Links */}
                <div className='flex flex-col px-6 py-8 gap-6'>
                    <p className='text-lg font-medium text-slate-700 
                        hover:text-red-400 transition-colors cursor-pointer'>
                        Home
                    </p>
                    <p className='text-lg font-medium text-slate-700 
                        hover:text-red-400 transition-colors cursor-pointer'>
                        Classes
                    </p>
                    <Link href={'/tool'} onClick={() => setIsMenuOpen(false)}>
                        <Buttons text={'Try now'} />
                    </Link>
                </div>
            </div>

            {/* Backdrop */}
            {isMenuOpen && (
                <div
                    className='fixed inset-0 bg-black/30 z-[9] md:hidden'
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </>
    )
}

export default Navbar
