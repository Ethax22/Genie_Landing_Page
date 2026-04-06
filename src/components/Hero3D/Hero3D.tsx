"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

// Lazy-load the heavy 3D component so it doesn't block initial paint
const GenieModel = dynamic(() => import("./GenieModel"), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-brand-navy" />
    ),
});

/**
 * Full-screen Hero section with:
 *  - Interactive 3D scene (lamp → click → genie emerges)
 *  - Foreground text overlay with CTA buttons
 *  - id="hero" for scroll targeting
 */
export default function Hero3D() {
    return (
        <section
            id="hero"
            className="relative w-full min-h-screen overflow-hidden flex items-center"
        >
            {/* Ambient background effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[120px] pointer-events-none" />

            {/* Top Left Logo */}
            <div className="absolute top-6 left-6 md:top-8 md:left-10 z-50 flex items-center pointer-events-auto bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 shadow-[0_0_15px_rgba(157,78,221,0.2)] border border-white/30">
                <img src="/Landing page svg.svg" alt="Genie Logo" className="h-10 md:h-12 w-auto object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-6 pb-20">



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* ── Left: Text Content ── */}
                    <div className="order-2 lg:order-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                        >
                            <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-6 mt-8">
                                <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">
                                    Genie Hive V1 — Early Access
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 font-outfit text-white text-glow leading-tight">
                                From Idea to Income. <br />
                                <span className="gradient-text">Built for India.</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed font-inter"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            Script. Localize. Caption. Optimize. Get Paid via UPI. <br />
                            A security-first, AI creator workspace built for multilingual content.
                        </motion.p>

                        <motion.div
                            className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.6 }}
                        >
                            <Link href="/waitlist" className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white shadow-[0_0_30px_rgba(157,78,221,0.4)] hover:shadow-[0_0_40px_rgba(157,78,221,0.6)] transition-all hover:-translate-y-1 w-full sm:w-auto text-center">
                                Join the Waiting List
                            </Link>
                            <a href="#workflow" className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 font-bold text-white hover:bg-white/10 transition-all w-full sm:w-auto text-center">
                                See How It Works
                            </a>
                        </motion.div>
                    </div>

                    {/* ── Right: 3D Model ── */}
                    <motion.div
                        className="order-1 lg:order-2 relative w-full aspect-square max-h-[70vh] lg:max-h-none"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.3 }}
                    >
                        <div className="w-full h-full min-h-[400px] lg:min-h-[600px]">
                            <GenieModel />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-brand-navy to-transparent pointer-events-none z-10" />
        </section>
    );
}
