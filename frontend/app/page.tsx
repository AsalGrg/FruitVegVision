import React from 'react'
import Hero from '@/sections/Hero'
import Technologies from '@/sections/Technologies'
import Performance from '@/sections/Performance'
import TextRevealSection from '@/sections/TextRevealSection'

const page = () => {
  return (
    <div>
      <Hero/>
      <Technologies/>
      <TextRevealSection/>
      <Performance/>
    </div>
  )
}

export default page