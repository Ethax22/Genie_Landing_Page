"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, Receipt, ShieldCheck } from 'lucide-react';

export default function MonetizationSection() {
    return (
        <section className="py-24 relative z-10 bg-brand-navy">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col-reverse lg:flex-row gap-16 items-center">

                    {/* Left Visual - Animated Wallet UI */}
                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="glass-panel p-6 md:p-8 max-w-md mx-auto relative group"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" />
                            <div className="relative bg-[#0d1511]/80 backdrop-blur-xl border border-green-500/20 rounded-xl p-6">

                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="text-emerald-400" />
                                        <span className="font-semibold text-gray-200">Creator Wallet</span>
                                    </div>
                                    <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">UPI Ready</span>
                                </div>

                                <div className="mb-8">
                                    <p className="text-sm text-gray-400 mb-1">Available Balance</p>
                                    <h3 className="text-4xl font-bold text-white font-mono flex items-center">
                                        <span className="text-emerald-500 mr-2">₹</span>42,500.00
                                    </h3>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs">
                                                <ArrowDownLeft size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Brand Deal Payout</p>
                                                <p className="text-xs text-gray-500">Today, 2:45 PM</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-400">+₹15,000</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs">
                                                <ArrowUpRight size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Bank Withdrawal (NEFT)</p>
                                                <p className="text-xs text-gray-500">Yesterday, 9:00 AM</p>
                                            </div>
                                        </div>
                                        <span className="text-sm font-bold text-white">-₹5,000</span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm">
                                        <ArrowUpRight size={16} /> Withdraw
                                    </button>
                                    <button className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2 text-sm">
                                        <Receipt size={16} /> Receipts
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Content */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-6">
                                Built-in <span className="text-emerald-400">Monetization</span>
                            </h2>
                            <p className="text-gray-300 text-xl font-medium mb-4 italic">
                                “Monetization built into your workflow — not bolted on later.”
                            </p>
                            <p className="text-gray-400 text-lg mb-10 font-inter">
                                Genie doesn't just help you create; it helps you get paid. Manage brand deals and payouts without leaving the platform.
                            </p>

                            <ul className="space-y-5">
                                {[
                                    { title: "Direct UPI Payments", desc: "Receive money instantly from fans or brands via UPI." },
                                    { title: "2-Hour Settlement", desc: "Don't wait 30 days. Fast, reliable clearances." },
                                    { title: "Secure Ledger", desc: "Immutable, idempotent ledger technology." },
                                    { title: "Automated Receipts", desc: "Export professional GST-ready invoices instantly." }
                                ].map((item, idx) => (
                                    <motion.li
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.2 + (idx * 0.1) }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className="mt-1 bg-emerald-500/20 p-1.5 rounded-full text-emerald-400 shrink-0">
                                            <ShieldCheck size={16} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{item.title}</h4>
                                            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
