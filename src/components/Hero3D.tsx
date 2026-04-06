"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

// Abstract Magical Glowing Orb representing the Genie/Lamp
function GenieCharacter({ hovered }: { hovered: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const targetScale = hovered ? 1.2 : 0.8;
    const targetY = hovered ? 1.6 : 1.2;
    const targetX = hovered ? 0.5 : 1.0; // move closer to center when emerging fully

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY + Math.sin(state.clock.getElapsedTime() * 2) * 0.1, 0.05);
            groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.05);
            groupRef.current.scale.setScalar(THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.05));

            // Idle rotation
            groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.1;
        }
    });

    const skinMaterial = new THREE.MeshStandardMaterial({ color: "#0ea5e9", roughness: 0.3 }); // bright blue
    const goldMaterial = new THREE.MeshStandardMaterial({ color: "#fbbf24", roughness: 0.2, metalness: 0.8 });
    const redMaterial = new THREE.MeshStandardMaterial({ color: "#ef4444", roughness: 0.6 });
    const hairMaterial = new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.9 });
    const whiteMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.1 });

    return (
        <group ref={groupRef} position={[1.0, 1.2, 0]}>
            {/* Tail pointing down into the lamp */}
            <mesh material={skinMaterial} position={[0.2, -0.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
                <cylinderGeometry args={[0.35, 0.1, 0.8, 32]} />
            </mesh>

            {/* Belt */}
            <mesh material={redMaterial} position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.35, 0.08, 16, 32]} />
            </mesh>

            {/* Torso */}
            <mesh material={skinMaterial} position={[0, 0.2, 0]}>
                <cylinderGeometry args={[0.5, 0.35, 0.7, 32]} />
            </mesh>

            {/* Chest/Pecs */}
            <mesh material={skinMaterial} position={[-0.22, 0.4, 0.35]}>
                <sphereGeometry args={[0.25, 32, 32]} />
            </mesh>
            <mesh material={skinMaterial} position={[0.22, 0.4, 0.35]}>
                <sphereGeometry args={[0.25, 32, 32]} />
            </mesh>

            {/* Neck */}
            <mesh material={skinMaterial} position={[0, 0.65, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.2, 16]} />
            </mesh>

            {/* Head */}
            <mesh material={skinMaterial} position={[0, 0.9, 0]}>
                <sphereGeometry args={[0.3, 32, 32]} />
            </mesh>

            {/* Big Smile / Mouth (white overlay) */}
            <mesh material={whiteMaterial} position={[0, 0.85, 0.28]} rotation={[0.2, 0, 0]}>
                <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
            </mesh>

            {/* Nose */}
            <mesh material={skinMaterial} position={[0, 0.95, 0.35]} rotation={[-0.2, 0, 0]}>
                <capsuleGeometry args={[0.08, 0.1, 16, 16]} />
            </mesh>

            {/* Ears */}
            <mesh material={skinMaterial} position={[-0.35, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.05, 0.1, 16, 16]} />
            </mesh>
            <mesh material={skinMaterial} position={[0.35, 0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
                <capsuleGeometry args={[0.05, 0.1, 16, 16]} />
            </mesh>

            {/* Ear rings */}
            <mesh material={goldMaterial} position={[-0.4, 0.82, 0]} rotation={[Math.PI / 2, Math.PI / 4, 0]}>
                <torusGeometry args={[0.04, 0.015, 8, 16]} />
            </mesh>
            <mesh material={goldMaterial} position={[0.4, 0.82, 0]} rotation={[Math.PI / 2, -Math.PI / 4, 0]}>
                <torusGeometry args={[0.04, 0.015, 8, 16]} />
            </mesh>

            {/* Hair / Ponytail swooping forward */}
            <group position={[0, 1.25, -0.05]}>
                <mesh material={goldMaterial} position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[0.06, 0.02, 16, 16]} />
                </mesh>
                <mesh material={hairMaterial} position={[0, 0.1, 0.1]} rotation={[Math.PI / 4, 0, 0]}>
                    <cylinderGeometry args={[0.01, 0.08, 0.3, 16]} />
                </mesh>
                {/* swoosh point */}
                <mesh material={hairMaterial} position={[0, 0.25, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
                    <coneGeometry args={[0.04, 0.2, 16]} />
                </mesh>
            </group>

            {/* Curl Beard */}
            <mesh material={hairMaterial} position={[0, 0.7, 0.35]} rotation={[-Math.PI / 6, 0, 0]}>
                <cylinderGeometry args={[0.02, 0.06, 0.2, 16]} />
            </mesh>

            {/* Right Arm (viewer left) - Muscle Pose flex */}
            <group position={[-0.55, 0.4, 0]}>
                {/* upper arm */}
                <mesh material={skinMaterial} position={[-0.2, 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
                    <capsuleGeometry args={[0.13, 0.3, 16, 16]} />
                </mesh>
                {/* forearm pointing up */}
                <mesh material={skinMaterial} position={[-0.4, 0.5, 0]} rotation={[0, 0, -Math.PI / 8]}>
                    <capsuleGeometry args={[0.11, 0.3, 16, 16]} />
                </mesh>
                {/* fist */}
                <mesh material={skinMaterial} position={[-0.45, 0.75, 0]}>
                    <sphereGeometry args={[0.18, 16, 16]} />
                </mesh>
                {/* armband */}
                <mesh material={goldMaterial} position={[-0.35, 0.35, 0]} rotation={[0, 0, -Math.PI / 8]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.15, 16]} />
                </mesh>
            </group>

            {/* Left Arm (viewer right) - Hand on hip */}
            <group position={[0.55, 0.4, 0]}>
                {/* upper arm going out */}
                <mesh material={skinMaterial} position={[0.2, -0.1, 0]} rotation={[0, 0, -Math.PI / 6]}>
                    <capsuleGeometry args={[0.13, 0.3, 16, 16]} />
                </mesh>
                {/* forearm coming back to hip */}
                <mesh material={skinMaterial} position={[0.2, -0.45, 0.15]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
                    <capsuleGeometry args={[0.11, 0.25, 16, 16]} />
                </mesh>
                {/* fist on hip */}
                <mesh material={skinMaterial} position={[0.05, -0.55, 0.3]}>
                    <sphereGeometry args={[0.18, 16, 16]} />
                </mesh>
                {/* armband */}
                <mesh material={goldMaterial} position={[0.25, -0.3, 0.05]} rotation={[Math.PI / 4, 0, Math.PI / 6]}>
                    <cylinderGeometry args={[0.15, 0.15, 0.15, 16]} />
                </mesh>
            </group>

        </group>
    );
}

// Stylized 3D Genie Lamp made from standard Three.js primitives
function GenieLamp() {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current) {
            // Idle hover breathing effect
            groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
            // Slow rotation for mouse parallax
            groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    const lampMaterial = new THREE.MeshStandardMaterial({
        color: "#d4af37", // Gold
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 2
    });

    return (
        <group
            ref={groupRef}
            dispose={null}
            position={[0, -0.5, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <GenieCharacter hovered={hovered} />

            {/* Lamp Base */}
            <mesh material={lampMaterial} position={[0, -0.8, 0]}>
                <cylinderGeometry args={[0.6, 0.8, 0.2, 32]} />
            </mesh>
            <mesh material={lampMaterial} position={[0, -0.6, 0]}>
                <cylinderGeometry args={[0.3, 0.6, 0.3, 32]} />
            </mesh>

            {/* Lamp Body (Bowl) */}
            <mesh material={lampMaterial} position={[0, 0, 0]}>
                <sphereGeometry args={[0.9, 64, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
            </mesh>

            {/* Lamp Lid/Top */}
            <mesh material={lampMaterial} position={[0, 0.8, 0]}>
                <sphereGeometry args={[0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
            <mesh material={lampMaterial} position={[0, 1.1, 0]}>
                <cylinderGeometry args={[0.05, 0.1, 0.4, 16]} />
            </mesh>

            {/* Lamp Handle */}
            <mesh material={lampMaterial} position={[-0.9, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.5, 0.12, 16, 100, Math.PI]} />
            </mesh>

            {/* Lamp Spout */}
            <mesh material={lampMaterial} position={[1.1, 0.2, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <cylinderGeometry args={[0.08, 0.2, 0.8, 32]} />
            </mesh>

            {/* Magical Smoke/Particles Emerging from Spout */}
            <group position={[1.5, 0.8, 0]}>
                <Sparkles count={150} scale={2} size={3} speed={0.5} opacity={0.6} color="#9d4edd" noise={1} />
                <Sparkles count={50} scale={3} size={1.5} speed={1} opacity={0.8} color="#ffffff" noise={2} />
                <Sparkles count={20} scale={4} size={5} speed={0.2} opacity={0.3} color="#f72585" noise={1} />
            </group>
        </group>
    );
}

export default function Hero3D() {
    return (
        <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
            {/* 3D Background Canvas */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} color="#f72585" />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4361ee" />
                    <GenieLamp />
                    <Environment preset="night" />
                    {/* Subtle cursor parallax enabled by orbit controls with restricted angles */}
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        maxPolarAngle={Math.PI / 1.5}
                        minPolarAngle={Math.PI / 3}
                        autoRotate
                        autoRotateSpeed={0.5}
                    />
                </Canvas>
            </div>

            {/* Hero Content Overlay */}
            <div className="relative z-10 container mx-auto px-6 text-center mt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-6">
                        <span className="text-sm font-medium text-purple-200 tracking-wide uppercase">Genie V1 — Early Access</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 font-outfit text-white text-glow leading-tight">
                        From Idea to Income. <br />
                        <span className="gradient-text">Built for India.</span>
                    </h1>
                </motion.div>

                <motion.p
                    className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-inter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                >
                    Script. Localize. Caption. Optimize. Get Paid via UPI. <br />
                    A security-first, AI creator workspace built for multilingual content.
                </motion.p>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                >
                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-bold text-white shadow-[0_0_30px_rgba(157,78,221,0.4)] hover:shadow-[0_0_40px_rgba(157,78,221,0.6)] transition-all hover:-translate-y-1 w-full sm:w-auto">
                        Join the Waiting List
                    </button>
                    <button className="px-8 py-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 font-bold text-white hover:bg-white/10 transition-all w-full sm:w-auto">
                        See How It Works
                    </button>
                </motion.div>
            </div>

            {/* Subtle bottom gradient fade to next section */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-brand-navy to-transparent pointer-events-none z-10" />
        </section>
    );
}
