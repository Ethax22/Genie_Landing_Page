"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

const demoSteps = [
    { step: 1, title: "Create Idea on Board", desc: "Drag and drop inspirations.", color: "bg-blue-500" },
    { step: 2, title: "Generate Script", desc: "AI writing contextualized for your niche.", color: "bg-purple-500" },
    { step: 3, title: "Localize to Tamil", desc: "Context-aware regional translation.", color: "bg-pink-500" },
    { step: 4, title: "Upload Video", desc: "Fast ingest processing.", color: "bg-rose-500" },
    { step: 5, title: "Auto-Transcribe", desc: "Using local Whisper models.", color: "bg-orange-500" },
    { step: 6, title: "Generate Captions", desc: "Baked-in styling.", color: "bg-amber-500" },
    { step: 7, title: "Preview in 3G", desc: "Testing graceful degradation.", color: "bg-yellow-500" },
    { step: 8, title: "Schedule Content", desc: "Pushing to all platforms.", color: "bg-lime-500" },
    { step: 9, title: "Simulate UPI Payment", desc: "Monetizing the end result.", color: "bg-emerald-500" }
];

export default function DemoFlow() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end center"]
    });

    const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

    return (
        <section ref={containerRef} className="py-32 relative z-10 bg-[#0a0f16]">
            <div className="container mx-auto px-6 max-w-4xl text-center mb-20">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold font-outfit mb-6"
                >
                    See The <span className="text-purple-400">Flow</span>
                </motion.h2>
                <p className="text-gray-400 text-lg">A realistic walkthrough of Genie V1 from zero to paid.</p>
            </div>

            <div className="max-w-3xl mx-auto relative px-6">
                {/* Animated Line */}
                <div className="absolute left-10 md:left-1/2 top-0 bottom-0 w-1 bg-white/5 -translate-x-1/2 rounded-full overflow-hidden">
                    <motion.div
                        className="w-full bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 origin-top"
                        style={{ scaleY: pathLength }}
                    />
                </div>

                <div className="space-y-24">
                    {demoSteps.map((item, idx) => {
                        const isEven = idx % 2 === 0;
                        return (
                            <div key={idx} className={`relative flex items-center md:justify-between flex-col md:flex-row ${isEven ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-4 md:left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#0a0f16] border-4 border-white z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />

                                {/* Content Card */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className={`w-full md:w-5/12 ml-16 md:ml-0 glass-panel p-6 ${isEven ? 'text-left' : 'md:text-right text-left'}`}
                                >
                                    <div className={`inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${item.color}`}>
                                        <PlayCircle size={14} /> Step {item.step}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 font-outfit">{item.title}</h3>
                                    <p className="text-gray-400 text-sm">{item.desc}</p>
                                </motion.div>

                            </div>
                        )
                    })}
                </div>

                {/* End of Flow Celebration */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    className="mt-32 text-center relative z-20"
                >
                    <div className="inline-flex w-24 h-24 rounded-full bg-emerald-500/20 items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)]">
                        <span className="text-5xl">🎉</span>
                    </div>
                    <h3 className="text-3xl font-bold font-outfit text-emerald-400">Payment Received</h3>
                    <p className="text-gray-400 mt-2">End-to-end functionality, delivered.</p>
                </motion.div>

            </div>
        </section>
    );
}
