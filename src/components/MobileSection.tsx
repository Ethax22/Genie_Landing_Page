"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, WifiOff, Signal, SignalHigh, Download } from 'lucide-react';

export default function MobileSection() {
    const [networkMode, setNetworkMode] = useState<'4G' | '3G' | '2G' | 'Offline'>('3G');

    const getActiveNetworkDescription = () => {
        switch (networkMode) {
            case '4G': return "Full HD video previews, real-time collaboration.";
            case '3G': return "Optimized 480p previews, slightly delayed sync.";
            case '2G': return "Text & Voice mode only. Media auto-pauses.";
            case 'Offline': return "Local draft mode. Auto-sync on reconnection.";
            default: return "";
        }
    }

    return (
        <section className="py-24 relative z-10 bg-[#05060e] overflow-hidden border-b border-white/5">
            <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    <div className="lg:w-1/2 w-full order-2 lg:order-1 relative">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative mx-auto w-[280px] h-[580px] bg-black border-[6px] border-[#1f2238] rounded-[3rem] shadow-2xl overflow-hidden"
                        >
                            {/* iPhone Notch */}
                            <div className="absolute top-0 inset-x-0 h-6 bg-[#1f2238] rounded-b-2xl w-32 mx-auto z-20" />

                            {/* Screen Content */}
                            <div className="pt-10 px-4 h-full bg-brand-navy flex flex-col relative">

                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        {networkMode === 'Offline' ? <WifiOff size={16} className="text-red-400" /> : <Signal size={16} className={networkMode === '4G' ? 'text-green-400' : 'text-yellow-400'} />}
                                        <span className="text-xs font-bold text-white">{networkMode}</span>
                                    </div>
                                    <Download size={16} className="text-gray-400" />
                                </div>

                                <div className="space-y-4">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <h5 className="text-sm font-bold text-white mb-1">New Script: "Mumbai Vlog"</h5>
                                        <p className="text-xs text-gray-400 mb-2">Last edited 2m ago</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                                {networkMode === 'Offline' ? 'Draft Saved Locally' : 'Synced'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className={`p-3 rounded-xl border transition-all ${networkMode === '2G' || networkMode === 'Offline' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}>
                                        <div className="w-full h-32 bg-black/50 rounded-lg mb-2 flex items-center justify-center relative overflow-hidden">
                                            {networkMode === '2G' || networkMode === 'Offline' ? (
                                                <span className="text-xs text-red-400 font-medium z-10">Video Preview Disabled</span>
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-indigo-900/40" />
                                            )}

                                            {networkMode === '3G' && <span className="absolute bottom-2 right-2 text-[9px] bg-black/80 px-1 py-0.5 rounded text-white">480p</span>}
                                            {networkMode === '4G' && <span className="absolute bottom-2 right-2 text-[9px] bg-black/80 px-1 py-0.5 rounded text-white">1080p</span>}
                                        </div>
                                        <p className="text-xs text-gray-300 text-center">Video rendering mode</p>
                                    </div>
                                </div>

                                {/* Bottom nav */}
                                <div className="absolute bottom-4 left-4 right-4 h-14 bg-white/10 backdrop-blur border border-white/10 rounded-full flex justify-around items-center px-4">
                                    <div className="w-6 h-6 rounded-full bg-white/20" />
                                    <div className="w-6 h-6 rounded-full bg-white/20" />
                                    <div className="w-10 h-10 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] -mt-6 border-2 border-[#1f2238]" />
                                    <div className="w-6 h-6 rounded-full bg-white/20" />
                                    <div className="w-6 h-6 rounded-full bg-white/20" />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6">
                                Engineered for <br /><span className="text-amber-400">Indian Networks</span>
                            </h2>
                            <p className="text-gray-400 text-lg mb-8 font-inter">
                                India isn't always on 5G. Genie actively monitors your network state and automatically degrades gracefully, so your flow is never interrupted.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {['4G', '3G', '2G', 'Offline'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setNetworkMode(mode as '4G' | '3G' | '2G' | 'Offline')}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${networkMode === mode
                                                ? 'bg-amber-500 text-[#05060e] shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                                            }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>

                            <div className="bg-white/5 border border-amber-500/20 p-5 rounded-xl mb-10 min-h-[90px]">
                                <p className="text-amber-300 font-medium">{getActiveNetworkDescription()}</p>
                            </div>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                                        <Smartphone size={16} className="text-gray-300" />
                                    </div>
                                    <span className="text-gray-300 font-medium">Installable PWA directly from browser</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                                        <Download size={16} className="text-gray-300" />
                                    </div>
                                    <span className="text-gray-300 font-medium">Background sync engine via Service Workers</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
