"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Sparkles,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Star,
    Zap,
    Crown,
    Shield,
} from "lucide-react";

const perks = [
    {
        icon: Crown,
        title: "Founder Pricing Forever",
        desc: "Lock in early pricing that never increases, even as we add features.",
    },
    {
        icon: Zap,
        title: "Priority Onboarding",
        desc: "Skip the queue with dedicated setup assistance from our team.",
    },
    {
        icon: Star,
        title: "Shape the Product",
        desc: "Direct influence on our roadmap through exclusive founder feedback channels.",
    },
    {
        icon: Shield,
        title: "Extended Free Tier",
        desc: "Generous free usage limits exclusively for founding creators.",
    },
];

export default function WaitlistPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [queuePos, setQueuePos] = useState(0);
    const [formData, setFormData] = useState({
        email: "",
        role: "",
        language: "",
        name: "",
        socialHandle: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                setIsLoading(false);
                return;
            }

            setQueuePos(data.queuePosition);
            setIsSubmitted(true);
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <main className="min-h-screen bg-brand-navy relative overflow-hidden flex flex-col">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[200px] pointer-events-none" />

            {/* Top nav bar */}
            <nav className="relative z-20 container mx-auto px-6 py-6 flex items-center justify-between">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft
                        size={18}
                        className="group-hover:-translate-x-1 transition-transform"
                    />
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
                <div className="flex items-center pointer-events-auto bg-white/20 backdrop-blur-md rounded-xl px-3 py-2 shadow-[0_0_15px_rgba(157,78,221,0.2)] border border-white/30">
                    <img src="/Landing page svg.svg" alt="Genie Logo" className="h-8 md:h-10 w-auto object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
                </div>
            </nav>

            {/* Main content */}
            <div className="flex-1 relative z-10 container mx-auto px-6 py-8 lg:py-16 flex items-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* ── Left: Branding & Perks ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-6">
                            <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">
                                V1 — Limited Early Access
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-outfit tracking-tight mb-6 text-white leading-tight">
                            Become a{" "}
                            <span className="gradient-text">
                                Founding Creator
                            </span>
                        </h1>

                        <p className="text-gray-400 text-lg md:text-xl font-inter mb-12 max-w-lg leading-relaxed">
                            Join a handpicked cohort building the future of
                            India's creator economy. Early access.
                            Founder&nbsp;pricing. Priority everything.
                        </p>

                        {/* Perks list */}
                        <div className="space-y-6">
                            {perks.map((perk, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.3 + idx * 0.1,
                                        duration: 0.5,
                                    }}
                                    className="flex gap-4 items-start"
                                >
                                    <div className="mt-1 w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                                        <perk.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-base mb-0.5">
                                            {perk.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {perk.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ── Right: Form / Success ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.15 }}
                    >
                        <div className="glass-panel p-8 md:p-10 relative overflow-hidden">
                            {/* Decorative glow corner */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

                            <AnimatePresence mode="wait">
                                {!isSubmitted ? (
                                    <motion.form
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -30 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-6 relative z-10"
                                    >
                                        <div className="mb-2">
                                            <h2 className="text-2xl md:text-3xl font-bold font-outfit text-white mb-2">
                                                Reserve Your Spot
                                            </h2>
                                            <p className="text-gray-400 text-sm">
                                                Fill in your details to join the
                                                founding cohort.
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                Email Address{" "}
                                                <span className="text-red-400">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all"
                                                placeholder="creator@example.com"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">
                                                    Your Role{" "}
                                                    <span className="text-red-400">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    name="role"
                                                    value={formData.role}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-[#130b2c] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>
                                                        Select Role
                                                    </option>
                                                    <option value="creator">
                                                        Creator
                                                    </option>
                                                    <option value="agency">
                                                        Agency
                                                    </option>
                                                    <option value="brand">
                                                        Brand
                                                    </option>
                                                    <option value="freelancer">
                                                        Freelancer
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">
                                                    Primary Language{" "}
                                                    <span className="text-red-400">
                                                        *
                                                    </span>
                                                </label>
                                                <select
                                                    name="language"
                                                    value={formData.language}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full bg-[#130b2c] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>
                                                        Select Language
                                                    </option>
                                                    <option value="hindi">
                                                        Hindi
                                                    </option>
                                                    <option value="tamil">
                                                        Tamil
                                                    </option>
                                                    <option value="telugu">
                                                        Telugu
                                                    </option>
                                                    <option value="bengali">
                                                        Bengali
                                                    </option>
                                                    <option value="marathi">
                                                        Marathi
                                                    </option>
                                                    <option value="hinglish">
                                                        Hinglish
                                                    </option>
                                                    <option value="english">
                                                        English
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all"
                                                placeholder="Your name"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">
                                                Social Handle{" "}
                                                <span className="text-gray-500">
                                                    (Optional)
                                                </span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                                                    @
                                                </span>
                                                <input
                                                    type="text"
                                                    name="socialHandle"
                                                    value={formData.socialHandle}
                                                    onChange={handleChange}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/10 transition-all"
                                                    placeholder="username"
                                                />
                                            </div>
                                        </div>

                                        {error && (
                                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                                {error}
                                            </div>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white text-lg flex items-center justify-center gap-2 transition-all shadow-[0_0_30px_rgba(157,78,221,0.4)] hover:shadow-[0_0_50px_rgba(157,78,221,0.6)] hover:-translate-y-0.5 mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoading ? (
                                                <span className="animate-pulse">Submitting...</span>
                                            ) : (
                                                <>
                                                    <Sparkles size={20} />
                                                    Claim Founder Spot
                                                    <ArrowRight size={20} />
                                                </>
                                            )}
                                        </button>

                                        <p className="text-center text-xs text-gray-500 mt-3">
                                            No spam. We'll only email you when
                                            it's time.
                                        </p>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-6 space-y-6 relative z-10"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                bounce: 0.5,
                                                duration: 0.8,
                                            }}
                                            className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
                                        >
                                            <CheckCircle2
                                                size={40}
                                                className="text-green-400"
                                            />
                                        </motion.div>

                                        <h3 className="text-3xl font-bold font-outfit text-white">
                                            You're on the list! 🎉
                                        </h3>
                                        <p className="text-gray-400 text-lg">
                                            Your position in the founding
                                            cohort:
                                        </p>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="inline-flex items-baseline gap-1 font-mono text-6xl font-bold text-purple-400"
                                        >
                                            #{queuePos}
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="mt-8"
                                        >
                                            <Link
                                                href="/"
                                                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium"
                                            >
                                                <ArrowLeft size={16} />
                                                Back to Home
                                            </Link>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom footer line */}
            <div className="relative z-10 container mx-auto px-6 py-6 text-center">
                <p className="text-xs text-gray-600 font-mono">
                    Limited spots available for the V1 Founding Creators cohort.
                </p>
            </div>
        </main>
    );
}
