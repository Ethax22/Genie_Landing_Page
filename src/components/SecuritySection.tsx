"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileSearch, Database, Server, Key, Webhook } from 'lucide-react';

const securityFeatures = [
    { icon: Key, title: "Authentication", desc: "Argon2id password hashing, JWT short-lived access tokens, Refresh token rotation, Session/device binding, Breached password detection." },
    { icon: Lock, title: "Authorization", desc: "Strict RBAC + ABAC authorization down to the row level." },
    { icon: Server, title: "Application Security", desc: "Strict CSP with nonces, Trusted Types enforcement, API Rate limiting." },
    { icon: FileSearch, title: "Data & Assets", desc: "File upload AV scanning, S3 secure URLs, end-to-end encryption for sensitive variables." },
    { icon: Webhook, title: "Financial Security", desc: "Signed Razorpay webhooks, Idempotent ledger transactions." },
    { icon: Database, title: "Compliance", desc: "Tamper-proof hash-chained Audit logs for every action." }
];

export default function SecuritySection() {
    return (
        <section className="py-24 relative z-10 bg-[#04050a] border-y border-red-500/10 overflow-hidden">

            {/* Background Matrix-like grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,30,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center justify-center p-4 bg-red-500/10 rounded-full mb-6 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
                        <Shield className="text-red-500 relative z-10" size={40} />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold font-outfit mb-6 text-white"
                    >
                        Built Like <span className="text-red-500">Infrastructure.</span><br />
                        Not Like a Side Project.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 text-lg md:text-xl font-mono max-w-3xl mx-auto"
                    >
                        Military-grade security baseline for Genie V1. Your assets, scripts, and payments are protected by enterprise architecture.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {securityFeatures.map((feat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#0a0c14] border border-red-500/10 hover:border-red-500/30 p-6 rounded-xl transition-all group"
                        >
                            <div className="mb-4 text-red-500/70 group-hover:text-red-400 transition-colors">
                                <feat.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wide">{feat.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed font-mono">
                                {feat.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
