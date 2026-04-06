"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, Volume2, Globe, Wifi } from 'lucide-react';

const languages = [
    "Hindi", "Tamil", "Telugu", "Marathi",
    "Kannada", "Bengali", "Gujarati", "Punjabi", "Hinglish"
];

const intelligenceFeatures = [
    { icon: Languages, title: "Context-Aware Translation", desc: "Preserves cultural nuances and emotion across regions." },
    { icon: Volume2, title: "Code-Mix Generation", desc: "Seamlessly blends regional languages with English slang." },
    { icon: Globe, title: "Bhashini Fallback Integration", desc: "Guaranteed high-availability processing for Indic languages." },
    { icon: Wifi, title: "Network-Aware Preview", desc: "Optimizes media playback specifically for 3G/2G mobile networks." }
];

export default function IndiaSection() {
    const [activeLang, setActiveLang] = useState(languages[0]);

    return (
        <section className="py-24 relative z-10 overflow-hidden bg-[#070811] border-y border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left Content */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6">
                                <Globe size={16} /> <span>Bharat First</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6">
                                India-First <span className="text-indigo-400">Intelligence</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 font-inter">
                                Not a wrapper. A deeply native AI engine built to understand India's complex linguistic landscape.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {intelligenceFeatures.map((feat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="space-y-3"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <feat.icon size={20} />
                                    </div>
                                    <h4 className="font-bold text-white text-lg">{feat.title}</h4>
                                    <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Interactive Map / Visualizer */}
                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8 min-h-[400px] flex flex-col justify-center relative"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 font-outfit text-center">Supported Languages (V1)</h3>
                            <div className="flex flex-wrap gap-3 justify-center mb-10">
                                {languages.map((lang) => (
                                    <button
                                        key={lang}
                                        onClick={() => setActiveLang(lang)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeLang === lang
                                                ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-500'
                                                : 'bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:bg-white/10'
                                            }`}
                                    >
                                        {lang}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-[#0c0d1b] border border-white/10 rounded-xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold flex items-center gap-1">
                                        Sarvam AI <span className="opacity-50">/</span> Bhashini
                                    </span>
                                </div>
                                <p className="text-gray-300 font-mono text-sm leading-relaxed min-h-[60px] flex items-center">
                                    {`> Compiling optimized models for ${activeLang}...`}
                                    <motion.span
                                        animate={{ opacity: [0, 1, 0] }}
                                        transition={{ repeat: Infinity, duration: 0.8 }}
                                    >
                                        _
                                    </motion.span>
                                </p>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
