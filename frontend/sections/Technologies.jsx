'use client'
import ClassPill from '@/components/ClassPill'
import { generateColors } from '@/utils/constants'
import { useEffect, useState } from 'react'
import TechnologyCard from '@/components/TechnologyCard'

const Technologies = () => {

    const [Class_Colors, setClass_Colors] = useState({})
    useEffect(() => {
        const colors = generateColors();
        setClass_Colors(colors)
    }, [])

    return (
        <section className='px-8 py-20'>
            <div className=' text-center flex flex-col items-center w-full space-y-8'>
                <div className='text-wrapper space-y-4 w-full'>
                    <h2 className='flex flex-wrap w-full justify-center gap-2'>
                        <ClassPill CLASS='Under' COLOR={Class_Colors['apple_raw']} /> The
                        <ClassPill CLASS='Hood' COLOR={Class_Colors['strawberry']} />
                    </h2>

                    <p className=''>Enterprise-grade tools, assembled for real-time precision.</p>
                </div>


                <div className='w-full max-w-240 md:w-[88%]'>
                    <div className='grid grid-cols-[repeat(4,1fr)] w-full grid-rows-3 gap-4'>
                        <TechnologyCard span={2} src={'/technologies/ultralytics.png'} />
                        <TechnologyCard span={1} src={'/technologies/cuda.png'} />
                        <TechnologyCard span={1} src={'/technologies/pytorch.png'} />
                        <TechnologyCard span={1} src={'/technologies/roboflow.png'} />
                        <TechnologyCard span={1} src={'/technologies/open-cv.webp'} />
                        <TechnologyCard span={1} src={'/technologies/ONNX.png'} />
                        <TechnologyCard span={1} src={'/technologies/python.webp'} />
                        <TechnologyCard span={1} src={'/technologies/fast_api.png'} />
                        <TechnologyCard span={1} src={'/technologies/kaggle.png'} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Technologies