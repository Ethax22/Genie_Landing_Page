"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animated smoke/vapor effect for the genie's lower body.
 * Separate mesh component for the swirling mystical smoke
 * that the genie emerges from.
 */
export default function SmokeEffect() {
    const groupRef = useRef<THREE.Group>(null!);
    const smokeRefs = useRef<THREE.Mesh[]>([]);

    // Custom smoke shader material
    const smokeMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new THREE.Color("#4a1078") },
                uColor2: { value: new THREE.Color("#1a0a3e") },
                uOpacity: { value: 0.35 },
            },
            vertexShader: `
                uniform float uTime;
                varying vec2 vUv;
                varying float vY;

                // Simple noise function
                vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
                vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

                float snoise(vec2 v) {
                    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                                       -0.577350269189626, 0.024390243902439);
                    vec2 i  = floor(v + dot(v, C.yy));
                    vec2 x0 = v -   i + dot(i, C.xx);
                    vec2 i1;
                    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec4 x12 = x0.xyxy + C.xxzz;
                    x12.xy -= i1;
                    i = mod289(i);
                    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                        + i.x + vec3(0.0, i1.x, 1.0));
                    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                        dot(x12.zw,x12.zw)), 0.0);
                    m = m*m;
                    m = m*m;
                    vec3 x = 2.0 * fract(p * C.www) - 1.0;
                    vec3 h = abs(x) - 0.5;
                    vec3 ox = floor(x + 0.5);
                    vec3 a0 = x - ox;
                    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                    vec3 g;
                    g.x = a0.x * x0.x + h.x * x0.y;
                    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                    return 130.0 * dot(m, g);
                }

                void main() {
                    vUv = uv;
                    vY = position.y;

                    vec3 pos = position;
                    // Swirling displacement
                    float noise1 = snoise(vec2(pos.x * 2.0 + uTime * 0.3, pos.y * 2.0 + uTime * 0.2));
                    float noise2 = snoise(vec2(pos.z * 2.0 - uTime * 0.25, pos.y * 1.5 + uTime * 0.15));

                    // Stronger displacement at the bottom
                    float yFactor = smoothstep(0.5, -0.5, pos.y) * 0.15;

                    pos.x += noise1 * yFactor;
                    pos.z += noise2 * yFactor;
                    // Slight vertical undulation
                    pos.y += snoise(vec2(pos.x + uTime * 0.4, pos.z + uTime * 0.3)) * yFactor * 0.3;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float uTime;
                uniform vec3 uColor1;
                uniform vec3 uColor2;
                uniform float uOpacity;
                varying vec2 vUv;
                varying float vY;

                void main() {
                    // Gradient from purple to dark based on vertical position
                    vec3 color = mix(uColor2, uColor1, smoothstep(-0.6, 0.3, vY));

                    // Animate opacity with subtle pulsing
                    float pulse = sin(uTime * 1.5 + vUv.x * 6.28) * 0.1 + 0.9;

                    // Fade out at edges (radial) and bottom
                    float edgeFade = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);
                    float bottomFade = smoothstep(-0.8, -0.2, vY);

                    float alpha = uOpacity * pulse * edgeFade * bottomFade;

                    gl_FragColor = vec4(color, alpha);
                }
            `,
        });
    }, []);

    // Secondary wispy smoke material
    const wispMaterial = useMemo(() => {
        return new THREE.MeshPhysicalMaterial({
            color: new THREE.Color("#5a2d82"),
            emissive: new THREE.Color("#3a1078"),
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.2,
            roughness: 0.8,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
    }, []);

    // Smoke plume geometries
    const plumeGeos = useMemo(() => {
        const geos: THREE.ConeGeometry[] = [];
        for (let i = 0; i < 5; i++) {
            geos.push(new THREE.ConeGeometry(
                0.15 + i * 0.06, // radius increases
                0.3 + i * 0.1,   // height increases
                16 + i * 4,      // more segments for larger plumes
                4,
                true              // open-ended
            ));
        }
        return geos;
    }, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();

        // Update shader time
        smokeMaterial.uniforms.uTime.value = t;

        // Rotate smoke wisps
        smokeRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            mesh.rotation.y = t * (0.15 + i * 0.08) * (i % 2 === 0 ? 1 : -1);
            mesh.position.y = -0.6 - i * 0.12 + Math.sin(t * 0.8 + i) * 0.03;
        });
    });

    return (
        <group ref={groupRef} position={[0, 1.4, 0]}>
            {/* Main smoke column — shader-driven */}
            <mesh material={smokeMaterial} position={[0, -0.7, 0]}>
                <cylinderGeometry args={[0.30, 0.12, 0.8, 32, 16, true]} />
            </mesh>

            {/* Layered wispy smoke cones */}
            {plumeGeos.map((geo, i) => (
                <mesh
                    key={`plume-${i}`}
                    ref={(el) => {
                        if (el) smokeRefs.current[i] = el;
                    }}
                    geometry={geo}
                    material={wispMaterial}
                    position={[
                        Math.sin((i / 5) * Math.PI * 2) * 0.08,
                        -0.6 - i * 0.12,
                        Math.cos((i / 5) * Math.PI * 2) * 0.08,
                    ]}
                    rotation={[0, (i / 5) * Math.PI * 2, 0]}
                />
            ))}

            {/* Swirling ring at dissolution point */}
            <mesh
                position={[0, -0.5, 0]}
                rotation={[Math.PI / 2, 0, 0]}
            >
                <torusGeometry args={[0.25, 0.03, 8, 32]} />
                <meshStandardMaterial
                    color="#7c4dff"
                    emissive="#6c3ce0"
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.25}
                />
            </mesh>

            {/* Large soft glow sphere at base */}
            <mesh position={[0, -0.9, 0]}>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshStandardMaterial
                    color="#3a1078"
                    emissive="#6c3ce0"
                    emissiveIntensity={0.8}
                    transparent
                    opacity={0.15}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}
