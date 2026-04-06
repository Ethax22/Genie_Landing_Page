"use client";

import { useRef, useCallback, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollActivation {
    active: boolean;
    progress: number;
}

/**
 * Hook that uses GSAP ScrollTrigger to detect when the #hero section
 * scrolls past the viewport center. Returns a mutable ref whose
 * `.current` is updated every scroll frame without causing re-renders.
 */
export function useScrollActivation() {
    const state = useRef<ScrollActivation>({ active: false, progress: 0 });

    useEffect(() => {
        const heroEl = document.getElementById("hero");
        if (!heroEl) return;

        const trigger = ScrollTrigger.create({
            trigger: heroEl,
            start: "bottom center",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
                state.current.progress = self.progress;
                state.current.active = self.progress > 0.05;
            },
            onLeaveBack: () => {
                state.current.active = false;
                state.current.progress = 0;
            },
        });

        return () => {
            trigger.kill();
        };
    }, []);

    return state;
}
