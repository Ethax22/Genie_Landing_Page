"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Cpu, Server, Database } from 'lucide-react';

const stackCategories = [
    {
        icon: Layers,
        title: "Frontend",
        items: ["Next.js 14 App Router", "React 18", "Tailwind CSS v4", "Progressive Web App (PWA)"]
    },
    {
        icon: Server,
        title: "Backend & Storage",
        items: ["NestJS 10 Framework", "PostgreSQL Database", "Redis Caching Layer", "MinIO Object Storage"]
    },
    {
        icon: Cpu,
        title: "AI Engine",
        items: ["Sarvam AI (Primary)", "Bhashini (Fallback)", "Whisper (Local ASR)", "GPT-4o (Ideation only)"]
    },
    {
        icon: Database,
        title: "Infrastructure",
        items: ["Docker Compose", "Nginx Reverse Proxy", "FFmpeg Worker Pool", "Argon2id Hashing"]
    }
];

export default function TechStackSection() {
    return (
        <section className="py-24 relative z-10 bg-brand-navy border-t border-purple-500/10">
            <div className="container mx-auto px-6 max-w-7xl text-center">

                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-full mb-6"
                    >
                        <span className="text-sm font-mono text-purple-400 px-2 tracking-widest uppercase">V1 Technology Stack</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-outfit mb-6"
                    >
                        Powered by Modern <span className="text-purple-400">Primitives</span>
                    </motion.h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stackCategories.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-panel p-8 text-left hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="mb-6 w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <category.icon size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 font-outfit">{category.title}</h3>
                            <ul className="space-y-3">
                                {category.items.map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        {item}
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
