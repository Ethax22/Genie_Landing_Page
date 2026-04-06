"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function FinalCTA() {
    return (
        <section className="py-32 relative z-10 overflow-hidden flex items-center justify-center min-h-[60vh]">

            {/* Background radial gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0b16] to-[#1a0f35] z-0" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center justify-center p-4 bg-white/5 border border-white/10 rounded-full mb-8 shadow-2xl">
                        <Sparkles className="text-brand-glow animate-pulse" size={32} />
                    </div>

                    <h2 className="text-5xl md:text-7xl font-extrabold font-outfit mb-8 tracking-tight leading-tight">
                        India’s AI Creator Studio.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                            Starting with V1.
                        </span>
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
                        <Link href="/waitlist" className="px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white text-lg shadow-[0_0_40px_rgba(157,78,221,0.5)] hover:shadow-[0_0_60px_rgba(157,78,221,0.7)] transition-all hover:-translate-y-2 w-full sm:w-auto transform border border-purple-400/50 text-center">
                            Join the Waiting List
                        </Link>
                        <button className="px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 font-bold text-white text-lg hover:bg-white/10 transition-all w-full sm:w-auto">
                            Request Early Demo
                        </button>
                    </div>

                    <p className="mt-8 text-sm text-gray-500 font-mono text-center">
                        Limited spots available for the V1 Founding Creators cohort.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
