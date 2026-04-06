"use client";

import { useRef, useEffect } from "react";

export interface CursorState {
    /** Normalized -1..1 */
    x: number;
    y: number;
    /** World-space target positions (mapped from mouse) */
    worldX: number;
    worldY: number;
    /** Whether pointer device is available (false on touch-only) */
    hasPointer: boolean;
}

/**
 * Tracks cursor position in normalized and world-space coords.
 * Updated via native event listener – never causes React re-renders.
 * On mobile / touch-only, hasPointer stays false and values stay at 0.
 */
export function useCursorFollow() {
    const cursor = useRef<CursorState>({
        x: 0,
        y: 0,
        worldX: 0,
        worldY: 0,
        hasPointer: false,
    });

    useEffect(() => {
        // Detect fine pointer capability
        const mql = window.matchMedia("(pointer: fine)");
        cursor.current.hasPointer = mql.matches;

        if (!mql.matches) return; // Mobile → skip

        const onMove = (e: MouseEvent) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = -(e.clientY / window.innerHeight) * 2 + 1;
            cursor.current.x = nx;
            cursor.current.y = ny;
            // Map to world-space range (wider horizontal range)
            cursor.current.worldX = nx * 3;
            cursor.current.worldY = ny * 1.5 + 1; // +1 offset to keep genie in upper half
        };

        window.addEventListener("mousemove", onMove, { passive: true });
        return () => window.removeEventListener("mousemove", onMove);
    }, []);

    return cursor;
}
