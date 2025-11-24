"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Season = "spring" | "summer" | "autumn" | "winter";

const getSeason = (): Season => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return "spring";
    if (month >= 6 && month <= 8) return "summer";
    if (month >= 9 && month <= 11) return "autumn";
    return "winter";
};

const getParticles = (season: Season) => {
    switch (season) {
        case "spring":
            return "🌸"; // Cherry blossom / Pink flower
        case "summer":
            return "🌿"; // Leaf / Greenery
        case "autumn":
            return "🍁"; // Maple leaf
        case "winter":
            return "❄️"; // Snowflake
    }
};

const PARTICLE_COUNT = 25;

export default function SeasonalBackground() {
    const [season, setSeason] = useState<Season>("spring");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setSeason(getSeason());
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const particleChar = getParticles(season);

    // Generate random particles with stable IDs for this session
    const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
        id: i,
        x: Math.random() * 100, // 0-100vw
        delay: Math.random() * 10, // Random start delay
        duration: 10 + Math.random() * 10, // 10-20s duration
        size: 10 + Math.random() * 15, // 10-25px size
    }));

    return (
        <div className="fixed inset-0 z-[-10] pointer-events-none overflow-hidden" aria-hidden="true">
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    initial={{
                        y: "-10vh",
                        x: `${particle.x}vw`,
                        opacity: 0,
                        rotate: 0,
                    }}
                    animate={{
                        y: "110vh",
                        x: [`${particle.x}vw`, `${particle.x + (Math.random() * 10 - 5)}vw`], // Sway
                        opacity: [0, 0.6, 0], // Fade in then out
                        rotate: 360,
                    }}
                    transition={{
                        duration: particle.duration,
                        repeat: Infinity,
                        delay: particle.delay,
                        ease: "linear",
                    }}
                    style={{
                        position: "absolute",
                        fontSize: `${particle.size}px`,
                        color: season === "spring" ? "#ffb7b2" : undefined, // Slight tint for spring if needed, though emoji handles color
                    }}
                    className="opacity-50"
                >
                    {particleChar}
                </motion.div>
            ))}
        </div>
    );
}
