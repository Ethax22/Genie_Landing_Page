"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, CheckCircle2, Copy } from 'lucide-react';

export default function WaitlistForm() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [queuePos, setQueuePos] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setQueuePos(Math.floor(Math.random() * 500) + 1200); // Mock position
        setIsSubmitted(true);
    };

    return (
        <section className="py-32 relative flex items-center justify-center overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-outfit mb-6"
                    >
                        Be Among the First <span className="text-purple-400">Founding Creators</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg md:text-xl font-inter max-w-2xl mx-auto"
                    >
                        Early access. Founder pricing. Priority onboarding.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="glass-panel p-8 md:p-12 relative overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSubmit}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all focus:bg-white/10"
                                            placeholder="creator@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Your Role</label>
                                        <select required defaultValue="" className="w-full bg-[#130b2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none">
                                            <option value="" disabled>Select Role</option>
                                            <option value="creator">Creator</option>
                                            <option value="agency">Agency</option>
                                            <option value="brand">Brand</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Primary Language</label>
                                        <select required defaultValue="" className="w-full bg-[#130b2c] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none">
                                            <option value="" disabled>Select Language</option>
                                            <option value="hindi">Hindi</option>
                                            <option value="tamil">Tamil</option>
                                            <option value="telugu">Telugu</option>
                                            <option value="bengali">Bengali</option>
                                            <option value="marathi">Marathi</option>
                                            <option value="hinglish">Hinglish</option>
                                            <option value="english">English</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-300">Social Handle (Optional)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all focus:bg-white/10"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(157,78,221,0.3)] hover:shadow-[0_0_30px_rgba(157,78,221,0.5)] mt-8"
                                >
                                    <Sparkles size={20} />
                                    Claim Founder Spot
                                    <ArrowRight size={20} />
                                </button>
                            </motion.form>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8 space-y-6"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                                >
                                    <CheckCircle2 size={40} className="text-green-400" />
                                </motion.div>

                                <h3 className="text-3xl font-bold font-outfit">You're on the list!</h3>
                                <p className="text-gray-400 text-lg">Your current position in the founding cohort:</p>

                                <div className="inline-flex items-baseline justify-center gap-1 font-mono text-5xl font-bold text-purple-400">
                                    #{queuePos}
                                </div>

                                <div className="max-w-md mx-auto mt-10 p-6 rounded-xl border border-white/10 bg-white/5">
                                    <p className="text-sm text-gray-300 mb-4">Want to jump the queue? Share your exclusive referral link.</p>
                                    <div className="flex items-center gap-2 bg-[#0a0b16] p-2 rounded-lg border border-white/10">
                                        <code className="text-xs text-brand-glow truncate flex-1 px-2">genie.xyz/ref/aX9b2z</code>
                                        <button className="p-2 hover:bg-white/10 rounded-md transition-colors text-gray-300">
                                            <Copy size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
}
