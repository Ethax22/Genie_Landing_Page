"use client";

import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * Lamp model loaded from a GLB file.
 *
 * Color scheme (from reference):
 *  - Rich antique gold (#B8860B / #D4A017)
 *  - Warm metallic with patina
 *  - High metalness, moderate roughness for ornate feel
 */
export default function LampModel() {
    const { scene } = useGLTF("/models/lamp.glb");

    // Clone and apply the gold lamp material
    const lampScene = useMemo(() => {
        const cloned = scene.clone(true);

        // Compute bounding box for position-based shading
        const box = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        box.getSize(size);

        cloned.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // Rich antique gold PBR material
                mesh.material = new THREE.MeshStandardMaterial({
                    color: new THREE.Color("#D4A017"),
                    roughness: 0.28,
                    metalness: 0.92,
                    envMapIntensity: 3.0,
                    // Add subtle warm emissive for that magical inner glow
                    emissive: new THREE.Color("#8B6914"),
                    emissiveIntensity: 0.08,
                });
            }
        });
        return cloned;
    }, [scene]);

    return (
        <group position={[0, -1.2, 0]}>
            <primitive object={lampScene} />
        </group>
    );
}

// Pre-load the GLB
useGLTF.preload("/models/lamp.glb");
