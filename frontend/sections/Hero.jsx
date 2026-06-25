'use client'
import React, { useEffect, useState } from 'react'
import { generateColors } from '@/utils/constants'
import ClassPill from '@/components/ClassPill'
import HeroVideo from '@/components/HeroVideo'
import Buttons from '@/components/Buttons'
import Link from 'next/link'
const Hero = () => {

    const [Class_Colors, setClass_Colors] = useState({})
    useEffect(() => {
        const colors = generateColors();
        setClass_Colors(colors)

    }, [])

    return (
        <section className='p-8'>
            <div className=' flex flex-col justify-center items-center space-y-14'>

                <div className='md:w-2xl w-full min-h-[min(440px,50vh)] flex flex-col justify-center md:justify-end items-center text-center space-y-8'>

                    <div className='flex flex-col justify-center md:justify-end items-center w-full space-y-4'>
                        <h1 className='text-center flex flex-wrap justify-center'>
                            <div className='inline mr-4'>
                                <ClassPill CLASS={'See'} COLOR={Class_Colors['pineapple']} />
                            </div>
                            What's On Your Plate
                            <div className='inline ml-8'>
                                <ClassPill CLASS={'Instantly'} COLOR={Class_Colors['potato']} />
                            </div>
                        </h1>

                        <p className='text-[16px]'>Real-time food recognition powered by computer vision.
                        </p>
                    </div>

                    <div className='flex gap-4'>
                        <Link href={'/tool'}>
                            <Buttons text={'Try Now'} />
                        </Link>

                        <Link href={'#technologies_section'}>
                            <Buttons text={'Learn more'} type='sec' />
                        </Link>
                    </div>
                </div>


                <HeroVideo />

                <div className='flex items-center flex-col gap-4'>
                    <h3 className='sub-heading'>Classes trained on:</h3>
                    <div className='flex gap-4 flex-wrap items-center justify-center w-[min(100%,1200px)]'>

                        {Object.entries(Class_Colors).map(([key, value]) => (
                            <ClassPill CLASS={key} COLOR={value} staturate={true} key={key}/>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default Hero