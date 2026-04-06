"use client";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import LampModel from "./LampModel";
import GenieModel from "./GenieModel";
import SmokeEffect from "./SmokeEffect";
import Particles from "./Particles";
import { useScrollActivation } from "./useScrollActivation";
import { useCursorFollow } from "./useCursorFollow";

/**
 * R3F Canvas wrapper with cinematic lighting.
 * Mounted once, never re-mounts on scroll.
 * Hooks provide mutable refs that drive animation in useFrame
 * without triggering React re-renders.
 */
export default function CanvasScene() {
    const scrollRef = useScrollActivation();
    const cursorRef = useCursorFollow();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(!window.matchMedia("(pointer: fine)").matches);
    }, []);

    return (
        <Canvas
            camera={{ position: [0, 1.5, 6], fov: 45 }}
            dpr={[1, isMobile ? 1.25 : 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ position: "absolute", inset: 0 }}
        >
            {/* ── Cinematic Lighting Rig ── */}

            {/* Ambient fill — low to keep it dramatic */}
            <ambientLight intensity={0.3} color="#0a0020" />

            {/* Key light — warm directional from upper-right */}
            <directionalLight
                position={[5, 8, 5]}
                intensity={1.0}
                color="#e8d5f5"
            />

            {/* Fill light — cool purple from left */}
            <directionalLight
                position={[-5, 4, 3]}
                intensity={0.5}
                color="#7c4dff"
            />

            {/* Rim light — blue from behind */}
            <pointLight
                position={[0, 3, -5]}
                intensity={1.2}
                color="#4fc3f7"
                distance={15}
                decay={2}
            />

            {/* Purple accent from below-left */}
            <pointLight
                position={[-4, -1, -2]}
                intensity={0.8}
                color="#9d4edd"
                distance={12}
                decay={2}
            />

            {/* Pink accent from right */}
            <pointLight
                position={[4, 2, 2]}
                intensity={0.5}
                color="#f72585"
                distance={10}
                decay={2}
            />

            {/* Magical under-glow (below genie / above lamp) */}
            <pointLight
                position={[0.5, 0.2, 0]}
                intensity={0.6}
                color="#6c3ce0"
                distance={5}
                decay={2}
            />

            {/* HDRI environment for realistic reflections on gold */}
            <Environment preset="night" />

            {/* Static Lamp */}
            <LampModel />

            {/* Smoke Effect (separate mesh, below genie) */}
            <SmokeEffect />

            {/* Genie – follows cursor when scroll-activated */}
            <GenieModel />

            {/* Magical particles */}
            <Particles lowPower={isMobile} />
        </Canvas>
    );
}
