'use client'
import React from 'react'
import Lenis from "lenis";
import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger, SplitText);



const AnimationSetup = ({ children }) => {


    // initializing lenis scroll
    useEffect(() => {
        // Initialize a new Lenis instance for smooth scrolling
        const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            duration:1.2
        });

        // Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
        lenis.on("scroll", ScrollTrigger.update);

        // Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
        // This ensures Lenis's smooth scroll animation updates on each GSAP tick
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000); // Convert time from seconds to milliseconds
        });

        // Disable lag smoothing in GSAP to prevent any delay in scroll animations
        gsap.ticker.lagSmoothing(0);
    }, []);

    return (
        <>{children}</>
    )
}

export default AnimationSetup