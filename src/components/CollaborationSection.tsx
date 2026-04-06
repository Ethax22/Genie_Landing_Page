"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Filter, BookOpen, Clock, Activity } from 'lucide-react';

export default function CollaborationSection() {
    return (
        <section className="py-24 relative z-10 bg-brand-navy">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6">
                                The <span className="text-blue-400">Collaboration</span> Layer
                            </h2>
                            <p className="text-gray-400 text-lg mb-10 font-inter max-w-lg">
                                Stop emailing scripts back and forth. Real-time multiplayer synchronization ensures your entire team is always on the exact same frame.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { icon: Activity, title: "Real-time Multiplayer Boards", desc: "Live cursors and instant updates across your workspace." },
                                    { icon: Clock, title: "Version Snapshots & Comments", desc: "Time-travel through script revisions with actionable comments." },
                                    { icon: Filter, title: "Project-Scoped Access", desc: "Granular control over who can view, edit, or publish." },
                                    { icon: BookOpen, title: "Brand Glossary Enforcement", desc: "AI automatically enforces brand guidelines across all content." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-4">
                                        <div className="mt-1 w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                                            <item.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-lg mb-1">{item.title}</h4>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative p-2 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                        >
                            <div className="bg-[#0f1225] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
                                {/* Mock UI Header */}
                                <div className="bg-[#161a33] p-4 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full border-2 border-[#161a33] bg-blue-500 text-xs flex items-center justify-center font-bold text-white z-20">AJ</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-[#161a33] bg-purple-500 text-xs flex items-center justify-center font-bold text-white z-10">PK</div>
                                        <div className="w-8 h-8 rounded-full border-2 border-[#161a33] bg-pink-500 text-xs flex items-center justify-center font-bold text-white z-0">SR</div>
                                    </div>
                                </div>

                                {/* Mock UI Body */}
                                <div className="p-6 h-[400px] relative">
                                    <div className="mb-4 w-3/4 h-8 bg-white/5 rounded" />
                                    <div className="mb-2 w-full h-4 bg-white/5 rounded" />
                                    <div className="mb-2 w-full h-4 bg-white/5 rounded" />
                                    <div className="mb-6 w-5/6 h-4 bg-white/5 rounded" />

                                    {/* Mock Comment Bubble */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: "spring" }}
                                        className="absolute top-24 left-1/4 bg-blue-600 text-white p-3 rounded-lg rounded-tl-none shadow-lg max-w-[200px]"
                                    >
                                        <p className="text-xs">"Make sure to use the new brand glossary here!" - Priya</p>
                                    </motion.div>

                                    {/* Mock Cursors */}
                                    <motion.div
                                        animate={{ x: [0, 100, 50, 200], y: [0, 50, 150, 100] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                                        className="absolute top-1/2 left-1/4 flex flex-col items-center"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pink-400 -rotate-45 drop-shadow-lg"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" /></svg>
                                        <span className="bg-pink-400 text-white text-[10px] px-1.5 py-0.5 rounded mt-1 shadow-sm font-bold">Rajan</span>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
