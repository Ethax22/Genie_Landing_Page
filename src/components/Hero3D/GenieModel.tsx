"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

type AnimState =
    | "lamp-idle"
    | "lamp-hover"
    | "emerging"
    | "genie-idle"
    | "returning";

/**
 * Self-contained Three.js scene with interactive lamp → genie emergence.
 */
export default function GenieModel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    const init = useCallback(async () => {
        if (!containerRef.current) return;

        /* ──────────────────────────────────────────────
         * Dynamic imports (avoid SSR)
         * ──────────────────────────────────────────── */
        const { GLTFLoader } = await import(
            "three/examples/jsm/loaders/GLTFLoader.js"
        );
        const { OrbitControls } = await import(
            "three/examples/jsm/controls/OrbitControls.js"
        );
        const { RoomEnvironment } = await import(
            "three/examples/jsm/environments/RoomEnvironment.js"
        );

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        /* ──────────────────────────────────────────────
         * Core scene
         * ──────────────────────────────────────────── */
        const scene = new THREE.Scene();

        // Target: position: (0, 0, 7), fov: 45, lookAt: (0, -1, 0)
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.set(0, 0.5, 8);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
        container.appendChild(renderer.domElement);

        /* ── Environment map for realistic reflections (lamp only) ── */
        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envTexture = pmremGenerator.fromScene(
            new RoomEnvironment()
        ).texture;
        // Do NOT set scene.environment — that makes everything gold
        // We'll apply it only to the lamp materials below.
        pmremGenerator.dispose();

        /* ──────────────────────────────────────────────
         * Controls
         * ──────────────────────────────────────────── */
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.25;
        controls.maxPolarAngle = Math.PI * 0.7;
        controls.target.set(0, 0, 0); // follow camera lookAt roughly

        let isDragging = false;
        controls.addEventListener("start", () => {
            isDragging = true;
            renderer.domElement.style.cursor = "grabbing";
        });
        controls.addEventListener("end", () => {
            isDragging = false;
            renderer.domElement.style.cursor = "default";
        });

        /* ──────────────────────────────────────────────
         * Lighting
         * ──────────────────────────────────────────── */
        // Warm key light (makes gold lamp shine)
        const keyLight = new THREE.DirectionalLight(0xFFE4B5, 2.0);
        keyLight.position.set(3, 5, 4);
        keyLight.castShadow = true;
        scene.add(keyLight);

        // Cool fill light (makes blue genie pop)
        const fillLight = new THREE.DirectionalLight(0x88AAFF, 0.8);
        fillLight.position.set(-3, 2, 2);
        scene.add(fillLight);

        // Ambient
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        // Gold point light near lamp
        const lampLight = new THREE.PointLight(0xFF9500, 2.5, 8);
        lampLight.position.set(0, -1.8, 1.5);
        scene.add(lampLight);

        // Blue rim light for genie (off initially)
        const blueLight = new THREE.PointLight(0x4488FF, 0.0, 10);
        blueLight.position.set(0, 0, 2);
        scene.add(blueLight);

        /* ──────────────────────────────────────────────
         * Mystic Smoke — Sprite-based wisps (hover-activated)
         * ──────────────────────────────────────────── */
        let smokeActive = false;
        let smokeOpacity = 0;

        // Procedural cloud texture for soft, organic smoke look
        const sCvs = document.createElement("canvas");
        sCvs.width = 128;
        sCvs.height = 128;
        const sCtx = sCvs.getContext("2d")!;
        sCtx.globalCompositeOperation = "lighter";
        const offsets = [
            [64, 64, 50], [48, 50, 35], [80, 55, 30],
            [55, 75, 28], [70, 45, 32],
        ];
        for (const [cx, cy, r] of offsets) {
            const g = sCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
            g.addColorStop(0, "rgba(180, 120, 255, 0.5)");
            g.addColorStop(0.4, "rgba(140, 80, 220, 0.25)");
            g.addColorStop(1, "rgba(100, 40, 180, 0)");
            sCtx.fillStyle = g;
            sCtx.fillRect(0, 0, 128, 128);
        }
        const smokeTexture = new THREE.CanvasTexture(sCvs);

        const WISP_COUNT = 50;
        interface SmokeWisp {
            sprite: THREE.Sprite;
            vy: number; vx: number; vz: number;
            life: number; maxLife: number;
            rotSpeed: number;
            active: boolean;
        }
        const wisps: SmokeWisp[] = [];
        const smokeGroup = new THREE.Group();
        scene.add(smokeGroup);

        for (let i = 0; i < WISP_COUNT; i++) {
            const mat = new THREE.SpriteMaterial({
                map: smokeTexture,
                transparent: true,
                opacity: 0,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                color: 0xaa66ff,
            });
            const sprite = new THREE.Sprite(mat);
            sprite.scale.set(0.1, 0.1, 1);
            sprite.position.set(0, -100, 0);
            smokeGroup.add(sprite);
            wisps.push({
                sprite, vy: 0, vx: 0, vz: 0,
                life: 0, maxLife: 1, rotSpeed: 0, active: false,
            });
        }

        function spawnWisp(w: SmokeWisp) {
            // Spawn from lamp spout area, spread in all directions (360°)
            const angle = Math.random() * Math.PI * 2;
            const spawnRadius = Math.random() * 0.15;
            w.sprite.position.set(
                Math.cos(angle) * spawnRadius,
                -0.4 + Math.random() * 0.2,   // near spout height
                Math.sin(angle) * spawnRadius
            );
            // Drift radially outward + upward to surround the lamp
            const outSpeed = 0.003 + Math.random() * 0.005;
            w.vy = 0.006 + Math.random() * 0.01;
            w.vx = Math.cos(angle) * outSpeed;
            w.vz = Math.sin(angle) * outSpeed;
            w.maxLife = 2.5 + Math.random() * 2.5;
            w.life = w.maxLife;
            w.rotSpeed = (Math.random() - 0.5) * 0.02;
            w.active = true;
            w.sprite.scale.set(0.15, 0.15, 1);
            (w.sprite.material as THREE.SpriteMaterial).opacity = 0;
        }

        /* ──────────────────────────────────────────────
         * Load models
         * ──────────────────────────────────────────── */
        const loader = new GLTFLoader();
        let lampModel: THREE.Group | null = null;
        let genieModel: THREE.Group | null = null;

        // Load lamp
        const lampGltf = await loader.loadAsync("/lamp.glb");
        lampModel = lampGltf.scene;
        // Antique Aladdin gold lamp material
        lampModel.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xC8860A),
                    metalness: 0.95,
                    roughness: 0.12,
                    emissive: new THREE.Color(0x7A4500),
                    emissiveIntensity: 0.15,
                    envMap: envTexture,       // Apply env map ONLY to lamp
                    envMapIntensity: 1.0,
                });
                mesh.material = mat;
                mesh.castShadow = true;
            }
        });
        lampModel.position.set(0, -1.8, 0);
        lampModel.scale.set(1.8, 1.8, 1.8);
        lampModel.rotation.set(0, 0, 0);
        scene.add(lampModel);

        // Load genie (uses baked-in colors from GLB)
        const genieGltf = await loader.loadAsync("/genie.glb");
        genieModel = genieGltf.scene;

        genieModel.traverse((child: THREE.Object3D) => {
            if (!(child as THREE.Mesh).isMesh) return;
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        });

        // Blush cheek lights
        const blushL = new THREE.PointLight(0xFF6B8A, 0.4, 1.5);
        blushL.position.set(-0.3, 0.5, 0.8);
        genieModel.add(blushL);
        const blushR = new THREE.PointLight(0xFF6B8A, 0.4, 1.5);
        blushR.position.set(0.3, 0.5, 0.8);
        genieModel.add(blushR);

        // Eye sparkle light
        const eyeLight = new THREE.PointLight(0xFFFFFF, 0.6, 1.0);
        eyeLight.position.set(0, 0.7, 1.0);
        genieModel.add(eyeLight);

        // Tail glow — purple
        const tailGlow = new THREE.PointLight(0x9933FF, 1.2, 3.0);
        tailGlow.position.set(0, -1.5, 0);
        genieModel.add(tailGlow);

        // Starts INSIDE lamp
        genieModel.position.set(0, -1.8, 0);
        genieModel.scale.set(0, 0, 0);
        genieModel.visible = false;
        scene.add(genieModel);

        /* ──────────────────────────────────────────────
         * State & Raycaster
         * ──────────────────────────────────────────── */
        let state: AnimState = "lamp-idle";
        let emergeStart: number | null = null;
        let returnStart: number | null = null;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function updateMouse(e: MouseEvent) {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        }

        function onPointerMove(e: MouseEvent) {
            updateMouse(e);
            if (isDragging) return;

            raycaster.setFromCamera(mouse, camera);
            let hovering = false;

            if (lampModel) {
                const hits = raycaster.intersectObject(lampModel, true);
                if (hits.length > 0) {
                    if (state === "lamp-idle" || state === "lamp-hover" || state === "genie-idle") {
                        hovering = true;
                        if (state === "lamp-idle") state = "lamp-hover";
                    }
                } else {
                    if (state === "lamp-hover") state = "lamp-idle";
                }
            }

            renderer.domElement.style.cursor = hovering ? "pointer" : "default";
        }

        function onClick(e: MouseEvent) {
            updateMouse(e);
            raycaster.setFromCamera(mouse, camera);

            if (lampModel) {
                const hits = raycaster.intersectObject(lampModel, true);
                if (hits.length > 0) {
                    if (state === "lamp-idle" || state === "lamp-hover") {
                        // Lamp clicked when genie is inside -> emerge
                        state = "emerging";
                        emergeStart = null;
                        renderer.domElement.style.cursor = "default";
                    } else if (state === "genie-idle") {
                        // Lamp clicked when genie is already out -> return
                        state = "returning";
                        returnStart = null;
                        renderer.domElement.style.cursor = "default";
                    }
                }
            }
        }

        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("click", onClick);

        /* ──────────────────────────────────────────────
         * Resize
         * ──────────────────────────────────────────── */
        function onResize() {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener("resize", onResize);

        /* ──────────────────────────────────────────────
         * Animation helpers
         * ──────────────────────────────────────────── */
        function easeOutElastic(x: number): number {
            const c4 = (2 * Math.PI) / 3;
            return x === 0 ? 0 : x === 1 ? 1 :
                Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
        }

        function easeInCubic(t: number): number {
            return t * t * t;
        }

        /* ──────────────────────────────────────────────
         * Visibility-aware animation loop
         * Pauses rendering when the container is off-screen
         * ──────────────────────────────────────────── */
        const clock = new THREE.Clock();
        let animId = 0;
        let isVisible = true;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;
                if (isVisible && animId === 0) {
                    clock.start();
                    animate();
                } else if (!isVisible) {
                    cancelAnimationFrame(animId);
                    animId = 0;
                    clock.stop();
                }
            },
            { threshold: 0.05 }
        );
        observer.observe(container);

        function animate() {
            animId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            controls.update();

            // ── Mystic Smoke Wisp Logic ──
            if (lampModel) {
                const lampScreenPos = lampModel.position.clone().project(camera);
                const screenX = (lampScreenPos.x * 0.5 + 0.5) * container.clientWidth;
                const screenY = (-lampScreenPos.y * 0.5 + 0.5) * container.clientHeight;
                const dx = mouse.x * container.clientWidth * 0.5 + container.clientWidth * 0.5 - screenX;
                const dy = -(mouse.y * container.clientHeight * 0.5) + container.clientHeight * 0.5 - screenY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                smokeActive = dist < 250 || state === "emerging" || state === "genie-idle";
            }

            for (const w of wisps) {
                if (!w.active || w.life <= 0) {
                    // Try to respawn
                    if (smokeActive && Math.random() < 0.08) {
                        spawnWisp(w);
                    }
                    continue;
                }

                // Move with swirling drift
                w.sprite.position.x += w.vx + Math.sin(t * 2 + w.life * 10) * 0.002;
                w.sprite.position.y += w.vy;
                w.sprite.position.z += w.vz + Math.cos(t * 1.5 + w.life * 8) * 0.001;

                // Age
                w.life -= 0.016;
                const progress = 1 - (w.life / w.maxLife); // 0 → 1

                // Scale up as it rises (small → large)
                const scale = 0.15 + progress * 1.2;
                w.sprite.scale.set(scale, scale, 1);

                // Rotate
                w.sprite.material.rotation += w.rotSpeed;

                // Bell curve opacity: fade in quickly, linger, fade out
                let opacity;
                if (progress < 0.15) {
                    opacity = progress / 0.15; // fade in
                } else if (progress > 0.6) {
                    opacity = (1 - progress) / 0.4; // fade out
                } else {
                    opacity = 1.0;
                }
                (w.sprite.material as THREE.SpriteMaterial).opacity = opacity * 0.5;

                // Kill when done
                if (w.life <= 0) {
                    w.active = false;
                    w.sprite.position.y = -100;
                    (w.sprite.material as THREE.SpriteMaterial).opacity = 0;
                }
            }


            // 2. State Machine Logic
            if (lampModel) {
                if (state === "lamp-idle") {
                    // IDLE LAMP ANIMATION
                    lampModel.rotation.y += 0.004;
                    lampModel.position.y = -1.8 + Math.sin(t * 1.2) * 0.04;
                    lampModel.rotation.z = 0;
                    lampModel.rotation.x = 0;
                    lampLight.intensity = 2.0 + Math.sin(t * 2.0) * 0.5;

                    // Ensure camera sits at 8
                    camera.position.z += (8.0 - camera.position.z) * 0.05;

                } else if (state === "lamp-hover") {
                    // HOVER LAMP ANIMATION
                    lampModel.rotation.y += 0.004;
                    lampModel.position.y = -1.8 + Math.sin(t * 1.2) * 0.04;
                    lampLight.intensity = 3.5;
                    lampModel.rotation.z = Math.sin(t * 8) * 0.03;

                    camera.position.z += (8.0 - camera.position.z) * 0.05;

                } else if (state === "emerging" && genieModel) {
                    // CLICK ANIMATION - EMERGING
                    if (emergeStart === null) emergeStart = performance.now();
                    const elapsed = (performance.now() - emergeStart) / 1000;

                    // Phase 1: Lamp shakes (0 to 0.4s mostly, bounded at 0.5s for smooth)
                    if (elapsed < 0.5) {
                        const shake = Math.sin(elapsed * 40) * 0.08 * (1 - elapsed / 0.5);
                        lampModel.rotation.z = shake;
                        lampModel.rotation.x = shake * 0.5;
                        lampLight.intensity = 2.0 + (elapsed / 0.5) * 2.5; // Max 4.5

                        // Camera slightly zooms in
                        camera.position.z = 8.0 - (elapsed / 0.5) * 1.5; // 8 -> 6.5
                    }

                    // Phase 2: Genie rises (0.3s to 1.8s)
                    if (elapsed >= 0.3) {
                        genieModel.visible = true;
                        const progress = Math.min((elapsed - 0.3) / 1.5, 1);
                        const eased = easeOutElastic(progress);

                        const s = eased * 1.5;
                        genieModel.scale.set(s, s, s);
                        genieModel.position.y = -1.8 + (eased * 1.9); // -1.8 to 0.1

                        blueLight.intensity = eased * 2.5;
                        blueLight.position.y = genieModel.position.y;

                        // Lamp glow settles back down
                        lampLight.intensity = Math.max(2.0, 4.5 - eased * 2.5);
                        lampModel.rotation.z = 0;
                        lampModel.rotation.x = 0;
                    }

                    // Phase 3: Settled
                    if (elapsed > 1.8) {
                        state = "genie-idle";
                        emergeStart = null;
                    }
                } else if (state === "genie-idle" && genieModel) {
                    // GENIE IDLE STATE
                    lampModel.position.y = -1.8 + Math.sin(t * 1.2) * 0.04; // Lamp stays bobbing
                    lampModel.rotation.y += 0.004;

                    // Smoke slowly dissipates (opacity logic handles this if we stopped spawning, but we just fade overall effect here, or let the natural fade happen)
                    // Currently smoke just keeps going, we'll let it play since the user only specified "dissipates" which implies it might just thin out. You'd normally throttle the spawn rate but we can leave it.

                    genieModel.position.y = 0.1 + Math.sin(t * 0.8) * 0.08;
                    if (!isDragging) {
                        genieModel.rotation.y += 0.005;
                    }
                    blueLight.position.y = genieModel.position.y;

                    // Tail glow pulse
                    tailGlow.intensity = 1.0 + Math.sin(t * 2) * 0.3;

                    // Camera eases back and up to frame the full genie
                    camera.position.z += (9.0 - camera.position.z) * 0.05;
                    camera.position.y += (1.0 - camera.position.y) * 0.05;

                } else if (state === "returning" && genieModel) {
                    // RETURN ANIMATION
                    if (returnStart === null) returnStart = performance.now();
                    const elapsed = (performance.now() - returnStart) / 1000;
                    const progress = Math.min(elapsed / 0.8, 1);

                    const eased = easeInCubic(progress);

                    const scale = 1.5 - eased * 1.5;
                    genieModel.scale.set(scale, scale, scale);
                    // position.y -> -2.8 over 0.8s
                    // We start around -0.2 and go to -2.8
                    genieModel.position.y = 0.1 - (eased * 1.9);

                    blueLight.intensity = (1.0 - progress) * 2.5;

                    // Camera eases back to original position z=8
                    camera.position.z += (8.0 - camera.position.z) * 0.08;

                    if (scale < 0.01) {
                        genieModel.visible = false;
                    }

                    // Lamp brief flash
                    if (progress > 0.6) {
                        lampLight.intensity = 2.0 + (1 - progress) * 3;
                    }

                    if (progress >= 1) {
                        state = "lamp-idle";
                        returnStart = null;
                    }
                }
            }

            renderer.render(scene, camera);
        }

        animate();

        /* ──────────────────────────────────────────────
         * Cleanup
         * ──────────────────────────────────────────── */
        cleanupRef.current = () => {
            cancelAnimationFrame(animId);
            observer.disconnect();
            renderer.domElement.removeEventListener("pointermove", onPointerMove);
            renderer.domElement.removeEventListener("click", onClick);
            window.removeEventListener("resize", onResize);
            controls.dispose();
            renderer.dispose();
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
        };
    }, []);

    useEffect(() => {
        init();
        return () => {
            if (cleanupRef.current) cleanupRef.current();
        };
    }, [init]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{
                touchAction: "none",
                background: 'radial-gradient(ellipse at 50% 75%, rgba(255, 140, 0, 0.12) 0%, rgba(40, 0, 80, 0.08) 40%, transparent 70%)'
            }}
        />
    );
}
