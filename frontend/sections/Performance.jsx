'use client'
import ClassPill from '@/components/ClassPill'
import HeroVideo from '@/components/HeroVideo'
import { generateColors } from '@/utils/constants'
import React, { useEffect, useState } from 'react'
import PerformanceCard from '@/components/PerformanceCard'

const Performance = () => {

  const [Class_Colors, setClass_Colors] = useState({})
  useEffect(() => {
    const colors = generateColors();
    setClass_Colors(colors)
  }, [])


  return (
    <section
      className='md:px-8 px-0'
    >
      <div className=' bg-[#e9f6e7] 
      py-20
      px-8
      rounded-lg
      overflow-hidden
      text-center flex flex-col items-center w-full space-y-12'>
        <div className='text-wrapper space-y-4 w-full'>
          <h2 className='flex flex-wrap w-full justify-center gap-x-8'>
            <ClassPill CLASS='Performance' COLOR={Class_Colors['apple_raw']} /> in
            <ClassPill CLASS='Real World' COLOR={Class_Colors['strawberry']} />
          </h2>

          <p className=''>Trained. Tested. Measured. Not estimated.
          </p>
        </div>


        <div className='flex gap-x-12 gap-y-8 items-center flex-wrap'>
          <div className='space-y-6 md:flex-1'>

            {/* overview */}
            <div className=' flex flex-col items-start text-start gap-2'>
              <h3 className='sub-heading'>
                Overview
              </h3>
              <p className=''>
                Our model doesn't just work in a lab environment.
                It was trained on <strong>4000</strong> labeled images across <strong>60 </strong>
                food classes and validated against a held-out test set to ensure the numbers you
                see reflect real detection conditions like variable lighting, partial occlusion,
                cluttered backgrounds.
              </p>


            </div>

            <div className=' flex flex-col items-start text-start gap-2'>
              <div className='w-full grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2'>
                <PerformanceCard number={'91%'} title={'mAP@50'} />
                <PerformanceCard number={'89.2%'} title={'Precision'} />
                <PerformanceCard number={'87.6%'} title={'Recall'} />
                <PerformanceCard number={'38 FPS'} title={'Inf. Speed'} />
                <PerformanceCard number={'0.82'} title={'Confidence'} />
              </div>
            </div>
          </div>
          <div className='lg:flex-1'>
            <HeroVideo />
          </div>
        </div>

      </div>
    </section>
  )
}

export default Performance