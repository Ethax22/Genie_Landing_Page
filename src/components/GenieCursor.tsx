"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";

/**
 * Magical cursor follower that appears after scrolling past the hero.
 * Uses refs + direct DOM manipulation for mouse tracking to avoid
 * React re-renders on every mousemove (major perf win during scroll).
 */
export default function GenieCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const handleMouseMove = (e: MouseEvent) => {
            // Direct DOM transform — no React re-render
            cursor.style.transform = `translate3d(${e.clientX - 16}px, ${e.clientY - 16}px, 0)`;
        };

        let scrollTicking = false;
        const handleScroll = () => {
            if (scrollTicking) return;
            scrollTicking = true;
            requestAnimationFrame(() => {
                setIsScrolling(window.scrollY > 300);
                scrollTicking = false;
            });
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-50 flex items-center justify-center mix-blend-screen"
            style={{
                opacity: isScrolling ? 1 : 0,
                transition: "opacity 0.5s ease",
                willChange: "transform",
            }}
        >
            {/* Core glow */}
            <div
                className="absolute w-12 h-12 bg-purple-500 rounded-full blur-xl opacity-60 animate-pulse"
            />
            <div
                className="absolute w-6 h-6 bg-fuchsia-400 rounded-full blur-md opacity-80 animate-pulse"
            />
            <div className="absolute w-3 h-3 bg-white rounded-full blur-[2px] shadow-[0_0_10px_white]" />

            {/* Decorative Sparkles */}
            <Sparkles size={12} className="absolute -top-4 -right-4 text-pink-300 animate-pulse" />
            <Sparkles size={8} className="absolute -bottom-4 -left-4 text-indigo-300 animate-bounce" />

            <div className="absolute -top-10 text-[10px] font-bold text-purple-200 uppercase tracking-widest opacity-50 whitespace-nowrap">
                Genie is watching
            </div>
        </div>
    );
}
