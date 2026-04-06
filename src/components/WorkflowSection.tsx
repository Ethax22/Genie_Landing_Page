"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    Lightbulb, PenTool, Globe, UploadCloud,
    FileAudio, Subtitles, Settings, Calendar, IndianRupee,
    BrainCircuit, LayoutDashboard, Database, Smartphone
} from 'lucide-react';

const steps = [
    { icon: Lightbulb, title: "Ideate", desc: "Visual boards & memory" },
    { icon: PenTool, title: "Script", desc: "AI writing & templates" },
    { icon: Globe, title: "Localize", desc: "8 regional languages" },
    { icon: UploadCloud, title: "Record", desc: "Offline capable" },
    { icon: FileAudio, title: "Transcribe", desc: "Regional voice-to-text" },
    { icon: Subtitles, title: "Caption", desc: "Auto-sync with styles" },
    { icon: Settings, title: "Optimize", desc: "Social & SEO tags" },
    { icon: Calendar, title: "Schedule", desc: "Bulk auto-posting" },
    { icon: IndianRupee, title: "Get Paid", desc: "Instant UPI settlement" },
];

const capabilities = [
    {
        title: "Core Workspace",
        icon: LayoutDashboard,
        features: ["Visual board", "Mind mapping", "Multiplayer collaboration", "Persistent memory", "Content templates", "Asset library with smart search", "Bulk scheduler"]
    },
    {
        title: "AI Generation",
        icon: BrainCircuit,
        features: ["Multi-model (Sarvam, Whisper)", "Script writing", "Social post generation", "Blog & Email content", "Sales copy", "Static ad creation"]
    },
    {
        title: "India Intelligence",
        icon: Database,
        features: ["8 regional languages", "Hinglish & Tanglish", "Regional voice-to-text", "Contextual translation", "Bhashini fallback"]
    },
    {
        title: "Mobile First",
        icon: Smartphone,
        features: ["PWA install", "Offline editing", "4G/3G preview", "2G text+voice mode"]
    }
];

export default function WorkflowSection() {
    return (
        <section id="workflow" className="py-24 relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-outfit mb-6"
                    >
                        From Idea to <span className="text-brand-glow">Income</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg md:text-xl font-inter max-w-2xl mx-auto"
                    >
                        The complete unfragmented pipeline built specifically for Indian creators.
                    </motion.p>
                </div>

                {/* 9-Step Workflow */}
                <div className="mb-32 relative">
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-purple-900 via-brand-glow to-purple-900 -translate-y-1/2 opacity-30" />

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-4 md:gap-6 relative z-10">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-brand-purple group-hover:scale-110 transition-all duration-300 shadow-lg">
                                    <step.icon className="text-brand-glow group-hover:text-white transition-colors" size={24} />
                                </div>
                                <h4 className="font-bold text-white mb-1 font-outfit">{step.title}</h4>
                                <p className="text-xs text-gray-400 max-w-[120px]">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Capabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {capabilities.map((cap, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-8 hover:border-brand-glow/30 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-purple-500/20 rounded-xl">
                                    <cap.icon className="text-purple-400" size={28} />
                                </div>
                                <h3 className="text-2xl font-bold font-outfit">{cap.title}</h3>
                            </div>

                            <ul className="space-y-3">
                                {cap.features.map((feature, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-3">
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-glow flex-shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
