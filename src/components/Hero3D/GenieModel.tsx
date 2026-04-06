"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";

type GenieState = "idle" | "emerging" | "vortex-idle" | "returning" | "locked";

export default function GenieModel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const cleanupRef = useRef<(() => void) | null>(null);

    const init = useCallback(async () => {
        if (!containerRef.current) return;

        const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");
        const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();

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

        const pmremGenerator = new THREE.PMREMGenerator(renderer);
        const envTexture = pmremGenerator.fromScene(new RoomEnvironment()).texture;
        pmremGenerator.dispose();

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.enablePan = false;
        controls.enableZoom = false;
        controls.minPolarAngle = Math.PI * 0.25;
        controls.maxPolarAngle = Math.PI * 0.7;
        controls.target.set(0, 0, 0);

        let isDragging = false;
        controls.addEventListener("start", () => {
            isDragging = true;
            renderer.domElement.style.cursor = "grabbing";
        });
        controls.addEventListener("end", () => {
            isDragging = false;
            renderer.domElement.style.cursor = "default";
        });

        // ── Lighting ──
        const keyLight = new THREE.DirectionalLight(0xFFE4B5, 2.0);
        keyLight.position.set(3, 5, 4);
        keyLight.castShadow = true;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight(0x88AAFF, 0.8);
        fillLight.position.set(-3, 2, 2);
        scene.add(fillLight);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const lampLight = new THREE.PointLight(0xFF9500, 2.5, 8);
        lampLight.position.set(0, -1.8, 1.5);
        scene.add(lampLight);

        // ── Mystic Smoke ──
        let smokeActive = false;
        const sCvs = document.createElement("canvas");
        sCvs.width = 128;
        sCvs.height = 128;
        const sCtx = sCvs.getContext("2d")!;
        sCtx.globalCompositeOperation = "lighter";
        const offsets = [[64, 64, 50], [48, 50, 35], [80, 55, 30], [55, 75, 28], [70, 45, 32]];
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
            sprite: THREE.Sprite; vy: number; vx: number; vz: number;
            life: number; maxLife: number; rotSpeed: number; active: boolean;
        }
        const wisps: SmokeWisp[] = [];
        const smokeGroup = new THREE.Group();
        scene.add(smokeGroup);

        for (let i = 0; i < WISP_COUNT; i++) {
            const mat = new THREE.SpriteMaterial({
                map: smokeTexture, transparent: true, opacity: 0,
                blending: THREE.AdditiveBlending, depthWrite: false, color: 0xaa66ff,
            });
            const sprite = new THREE.Sprite(mat);
            sprite.scale.set(0.1, 0.1, 1);
            sprite.position.set(0, -100, 0);
            smokeGroup.add(sprite);
            wisps.push({ sprite, vy: 0, vx: 0, vz: 0, life: 0, maxLife: 1, rotSpeed: 0, active: false });
        }

        function spawnWisp(w: SmokeWisp) {
            const angle = Math.random() * Math.PI * 2;
            const spawnRadius = Math.random() * 0.15;
            w.sprite.position.set(
                Math.cos(angle) * spawnRadius,
                -0.4 + Math.random() * 0.2, // Near spout height approximately
                Math.sin(angle) * spawnRadius
            );
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

        // ── Load Lamp model ──
        const loader = new GLTFLoader();
        let lampModel: THREE.Group | null = null;
        let lampSpoutPosition = new THREE.Vector3(1.2, -0.6, 0); // fallback approximate spout local pos
        
        const lampGltf = await loader.loadAsync("/lamp.glb");
        lampModel = lampGltf.scene;
        lampModel.traverse((child: THREE.Object3D) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const mat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(0xC8860A),
                    metalness: 0.95, roughness: 0.12,
                    emissive: new THREE.Color(0x7A4500), emissiveIntensity: 0.15,
                    envMap: envTexture, envMapIntensity: 1.0,
                });
                mesh.material = mat;
                mesh.castShadow = true;
            }
            
            // Helpful logging for debugging exact node names and spout local positions
            // console.log("Node:", child.name, child.position);
        });
        lampModel.position.set(0, -1.8, 0);
        lampModel.scale.set(1.8, 1.8, 1.8);
        scene.add(lampModel);

        // ── Vortex Particle System ──
        const isMobile = window.innerWidth < 768 || navigator.hardwareConcurrency < 4;
        const PARTICLE_COUNT = isMobile ? 800 : 3000;

        const particles = {
            geometry: new THREE.BufferGeometry(),
            count: PARTICLE_COUNT,
            positions: new Float32Array(PARTICLE_COUNT * 3),
            colors: new Float32Array(PARTICLE_COUNT * 3),
            angles: new Float32Array(PARTICLE_COUNT),
            radii: new Float32Array(PARTICLE_COUNT),
            speeds: new Float32Array(PARTICLE_COUNT),
            offsets: new Float32Array(PARTICLE_COUNT)
        };

        const goldColor = new THREE.Color("#F59E0B");
        const purpleColor = new THREE.Color("#8B5CF6");

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.angles[i] = Math.random() * Math.PI * 2;
            particles.radii[i] = 0; // starts at lamp spout
            particles.speeds[i] = 0.02 + Math.random() * 0.03;
            particles.offsets[i] = Math.random() * Math.PI * 2;
            
            const mixedColor = goldColor.clone().lerp(purpleColor, Math.random());
            particles.colors[i * 3] = mixedColor.r;
            particles.colors[i * 3 + 1] = mixedColor.g;
            particles.colors[i * 3 + 2] = mixedColor.b;
        }

        particles.geometry.setAttribute("position", new THREE.BufferAttribute(particles.positions, 3));
        particles.geometry.setAttribute("color", new THREE.BufferAttribute(particles.colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const particleSystem = new THREE.Points(particles.geometry, particleMaterial);
        particleSystem.visible = false;
        scene.add(particleSystem);


        // ── State & Raycaster ──
        let genieState: GenieState = "idle";
        let hoverState = false;

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
                    if (genieState === "idle" || genieState === "vortex-idle") {
                        hovering = true;
                    }
                }
            }
            hoverState = hovering;
            renderer.domElement.style.cursor = hovering ? "pointer" : "default";
        }

        // ── Actions ──
        function triggerEmerge() {
            if (genieState !== "idle") return; // click lock
            genieState = "locked";
            
            particleSystem.visible = true;
            
            gsap.to(particles.radii as any, {
                endArray: Array.from(particles.radii).map(() => 0.8 + Math.random() * 0.6),
                duration: 1.5,
                ease: "power2.out",
                onComplete: () => { genieState = "vortex-idle"; }
            });
            
            const letters = document.querySelectorAll(".genie-letter");
            gsap.set("#genie-text-overlay", { opacity: 1 });
            gsap.fromTo(letters, 
                { opacity: 0, y: 20, scale: 0.5 },
                { 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    duration: 0.1,
                    stagger: 0.06,
                    ease: "back.out(1.7)",
                    delay: 0.5
                }
            );
        }

        function triggerReturn() {
            if (genieState !== "vortex-idle") return; // click lock
            genieState = "locked";
            
            // Kill pulse
            gsap.killTweensOf(".genie-letter");
            
            // Reverse letter animation
            const letters = document.querySelectorAll(".genie-letter");
            gsap.to(letters, {
                opacity: 0,
                y: -20,
                scale: 0.3,
                duration: 0.08,
                stagger: { each: 0.04, from: "end" },
                ease: "power2.in"
            });
            
            gsap.to("#genie-text-overlay", { 
                opacity: 0, 
                duration: 0.3, 
                delay: 0.4 
            });
            
            // Particles shrink to 0
            gsap.to(particles.radii as any, {
                endArray: Array.from(new Float32Array(PARTICLE_COUNT)),
                duration: 1,
                ease: "power3.in",
                onComplete: () => {
                    particleSystem.visible = false;
                    genieState = "idle"; // unlock
                }
            });
        }

        function onClick(e: MouseEvent) {
            updateMouse(e);
            raycaster.setFromCamera(mouse, camera);

            if (lampModel) {
                const hits = raycaster.intersectObject(lampModel, true);
                if (hits.length > 0) {
                    if (genieState === "idle") {
                        triggerEmerge();
                    } else if (genieState === "vortex-idle") {
                        triggerReturn();
                    }
                }
            }
        }

        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("click", onClick);


        /* ── Resize ── */
        function onResize() {
            if (!container) return;
            const w = container.clientWidth;
            const h = container.clientHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        }
        window.addEventListener("resize", onResize);


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

            // ── Smoke ──
            if (lampModel) {
                const lampScreenPos = lampModel.position.clone().project(camera);
                const screenX = (lampScreenPos.x * 0.5 + 0.5) * container.clientWidth;
                const screenY = (-lampScreenPos.y * 0.5 + 0.5) * container.clientHeight;
                const dx = mouse.x * container.clientWidth * 0.5 + container.clientWidth * 0.5 - screenX;
                const dy = -(mouse.y * container.clientHeight * 0.5) + container.clientHeight * 0.5 - screenY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                smokeActive = dist < 250 || genieState === "emerging" || genieState === "vortex-idle";
            }

            for (const w of wisps) {
                if (!w.active || w.life <= 0) {
                    if (smokeActive && Math.random() < 0.08) spawnWisp(w);
                    continue;
                }
                w.sprite.position.x += w.vx + Math.sin(t * 2 + w.life * 10) * 0.002;
                w.sprite.position.y += w.vy;
                w.sprite.position.z += w.vz + Math.cos(t * 1.5 + w.life * 8) * 0.001;
                w.life -= 0.016;
                const progress = 1 - (w.life / w.maxLife); 
                const scale = 0.15 + progress * 1.2;
                w.sprite.scale.set(scale, scale, 1);
                w.sprite.material.rotation += w.rotSpeed;

                let opacity;
                if (progress < 0.15) opacity = progress / 0.15;
                else if (progress > 0.6) opacity = (1 - progress) / 0.4;
                else opacity = 1.0;
                (w.sprite.material as THREE.SpriteMaterial).opacity = opacity * 0.5;

                if (w.life <= 0) {
                    w.active = false;
                    w.sprite.position.y = -100;
                    (w.sprite.material as THREE.SpriteMaterial).opacity = 0;
                }
            }

            // ── Lamp & Camera Anim ──
            if (lampModel) {
                lampModel.rotation.y += 0.004;
                lampModel.position.y = -1.8 + Math.sin(t * 1.2) * 0.04;

                if (genieState === "idle") {
                    lampModel.rotation.z = Math.sin(t * 8) * (hoverState ? 0.03 : 0);
                    lampLight.intensity = hoverState ? 3.5 : (2.0 + Math.sin(t * 2.0) * 0.5);
                    camera.position.z += (8.0 - camera.position.z) * 0.05;
                    camera.position.y += (0.5 - camera.position.y) * 0.05; 
                } else if (genieState === "emerging") {
                    lampModel.rotation.z = Math.sin(t * 40) * 0.04;
                    lampLight.intensity = 4.5;
                    camera.position.z += (6.5 - camera.position.z) * 0.05;
                    camera.position.y += (1.5 - camera.position.y) * 0.05;
                } else if (genieState === "vortex-idle") {
                    lampLight.intensity = 3.0 + Math.sin(t * 2.0) * 0.5;
                    lampModel.rotation.z = 0;
                    camera.position.z += (7.0 - camera.position.z) * 0.02;
                    camera.position.y += (1.0 - camera.position.y) * 0.02;
                } else if (genieState === "returning") {
                    lampLight.intensity = 4.5;
                    camera.position.z += (8.0 - camera.position.z) * 0.05;
                    camera.position.y += (0.5 - camera.position.y) * 0.05;
                }
            }

            // ── Particles Update ──
            if (particleSystem.visible && lampModel) {
                const timeStr = Date.now() * 0.001;
                // Calculate dynamic world position for the origin point so it bobs with the lamp
                // The approximate lamp spout offset in world space relative to lamp origin
                const localSpoutOffset = new THREE.Vector3(1.1, 0.4, 0); 
                const worldSpoutPos = localSpoutOffset.clone().applyMatrix4(lampModel.matrixWorld);

                const spoutPosition = { x: worldSpoutPos.x, y: worldSpoutPos.y }; 
                
                for (let i = 0; i < PARTICLE_COUNT; i++) {
                    particles.angles[i] += particles.speeds[i];
                    
                    const x = spoutPosition.x + Math.cos(particles.angles[i] + particles.offsets[i]) * particles.radii[i];
                    const y = spoutPosition.y + Math.sin(timeStr + particles.offsets[i]) * 0.15 + particles.radii[i] * 0.4;
                    const z = Math.sin(particles.angles[i]) * particles.radii[i] * 0.4;
                    
                    particles.positions[i * 3] = x;
                    particles.positions[i * 3 + 1] = y;
                    particles.positions[i * 3 + 2] = z;
                }
                
                particles.geometry.attributes.position.needsUpdate = true;
            }

            renderer.render(scene, camera);
        }

        /* ── Cleanup ── */
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
            gsap.killTweensOf(particles.radii);
            gsap.killTweensOf(".genie-letter");
            gsap.killTweensOf("#genie-text-overlay");
        };
    }, []);

    useEffect(() => {
        init();
        return () => {
            if (cleanupRef.current) cleanupRef.current();
        };
    }, [init]);

    return (
        <div className="relative w-full h-full genie-canvas-container">
            {/* The 3D Canvas wrapper */}
            <div
                ref={containerRef}
                className="w-full h-full absolute inset-0"
                style={{
                    touchAction: "none",
                    background: 'radial-gradient(ellipse at 50% 75%, rgba(255, 140, 0, 0.12) 0%, rgba(40, 0, 80, 0.08) 40%, transparent 70%)'
                }}
            />
            {/* The GSAP text overlay */}
            <div 
                id="genie-text-overlay"
                style={{
                    position: "absolute",
                    top: "40%",
                    left: "50%", 
                    transform: "translate(-50%, -50%)",
                    pointerEvents: "none",
                    zIndex: 10,
                    opacity: 0,
                    display: "flex",
                    gap: "2px",
                    userSelect: "none"
                }}
            >
                {"Genie is Coming".split("").map((char, i) => (
                    <span 
                        key={i} 
                        className="genie-letter"
                        style={{ opacity: 0 }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                ))}
            </div>
        </div>
    );
}
