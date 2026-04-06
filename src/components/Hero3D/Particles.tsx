"use client";

import React from "react";
import { Sparkles } from "@react-three/drei";

interface ParticlesProps {
    /** Reduce count on mobile */
    lowPower?: boolean;
}

/**
 * Premium magical particle system with multiple layers:
 *  - Magical aura ring around genie's upper body
 *  - Rising mystical motes from hands
 *  - Large volumetric glow whisps
 *  - Tiny bright accent sparkles
 */
export default function Particles({ lowPower = false }: ParticlesProps) {
    const count = lowPower ? 40 : 120;

    return (
        <group position={[0, 1.2, 0]}>
            {/* ── Primary mystical aura (close to genie) ── */}
            <Sparkles
                count={count}
                scale={[3, 4, 3]}
                size={2.0}
                speed={0.25}
                opacity={0.5}
                color="#7c4dff"
                noise={1.2}
            />

            {/* ── Rising magical motes (from hands area upward) ── */}
            <Sparkles
                count={Math.floor(count * 0.5)}
                scale={[2, 6, 2]}
                size={1.2}
                speed={0.6}
                opacity={0.7}
                color="#b388ff"
                noise={2.5}
            />

            {/* ── Large volumetric glow wisps ── */}
            <Sparkles
                count={Math.floor(count * 0.12)}
                scale={[6, 7, 6]}
                size={6}
                speed={0.1}
                opacity={0.12}
                color="#6c3ce0"
                noise={0.8}
            />

            {/* ── Bright white accent highlights ── */}
            <Sparkles
                count={Math.floor(count * 0.25)}
                scale={[2.5, 3.5, 2.5]}
                size={1.0}
                speed={0.9}
                opacity={0.8}
                color="#e0c0ff"
                noise={2.2}
            />

            {/* ── Subtle pink/magenta undertone ── */}
            <Sparkles
                count={Math.floor(count * 0.1)}
                scale={[4, 5, 4]}
                size={3.5}
                speed={0.15}
                opacity={0.15}
                color="#d81b60"
                noise={1.0}
            />


        </group>
    );
}
