'use client'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/all'
import React, { useRef } from 'react'

const TextRevealSection = () => {

    const containerRef = useRef(null)
    useGSAP(() => {

        SplitText.create('h2', {
            type: 'chars, lines, words',
            autoSplit: true,
            onSplit: (self)=>{
                return gsap.fromTo(
                    self.words,
                    {opacity: 0.4},
                    {
                        opacity:1,
                        stagger:0.2,
                        scrollTrigger:{
                            trigger: containerRef.current,
                            pin: true,
                            scrub: 1,
                            start: 'top top',
                            end: "+=2000"
                        },
                        ease: 'power1.out'
                    }
                )
            }
        })

    }, { scope: containerRef })

    return (
        <section className='p-8 flex items-start'
            ref={containerRef}
        >

            <div className='min-h-120 flex items-center'>
                <h2 className='text-center text-3xl! sm:text-5xl!'>
                    Every meal tells a story.Most people never get to read it.We built a system that can — in milliseconds.Not by guessing. Not by averaging.By actually looking.Frame by frame. Item by item. Because knowing what you eat shouldn't require a nutrition degree. It should just require a camera.
                </h2>
            </div>
        </section>
    )
}

export default TextRevealSection