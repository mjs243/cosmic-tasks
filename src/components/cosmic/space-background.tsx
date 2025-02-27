import React, { useEffect, useState } from 'react';

interface SpaceParticle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
}

interface SpaceBackgroundProps {
    particleCount?: number;
    darkMode?: boolean;
}

export function SpaceBackground({
    particleCount = 30,
    darkMode = true
}: SpaceBackgroundProps) {
    const [particles, setParticles] = useState<SpaceParticle[]>([]);

    // Generate intitial particles
    useEffect(() => {
        const newParticles: SpaceParticle[] = [];
        for (let i = 0; i < particleCount; i++) {
            newParticles.push({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.1,
                speed: Math.random() * 0.05 + 0.01
            });
        }
        setParticles(newParticles);
    }, [particleCount]);
}