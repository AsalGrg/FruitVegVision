'use client'
import React, { useEffect, useState } from 'react'
import ClassPill from '../../components/ClassPill'
import Buttons from '../../components/Buttons'
import {generateColors} from '../../utils/constants'

const ToolsMainHero = () => {

  const [Class_Colors, setClass_Colors] = useState({})
  useEffect(() => {
    const colors = generateColors();
    setClass_Colors(colors)
  }, [])
  
    return(
      <section className='p-8'>
        <div className=' flex flex-col justify-center items-center space-y-14'>

          <div className='md:w-2xl w-full min-h-[min(300px,40vh)] flex flex-col justify-center md:justify-end items-center text-center space-y-8'>

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
          </div>
        </div>
      </section>
    )
}

export default ToolsMainHero