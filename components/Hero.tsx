"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
    return (
        <section className="min-h-[80vh] flex flex-col items-center justify-center relative px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center max-w-2xl"
            >
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-secondary text-sm uppercase tracking-widest mb-4 block"
                >
                    나만의 기록
                </motion.span>
                <h1 className="text-4xl md:text-6xl font-light tracking-tight text-primary mb-6 leading-tight">
                    오늘의 <span className="italic font-serif">순간</span>을 담다.
                </h1>
                <p className="text-secondary text-lg md:text-xl font-light leading-relaxed">
                    소중한 기억과 감정들을 모아두는 공간.
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown className="w-6 h-6 text-accent" />
                </motion.div>
            </motion.div>
        </section>
    );
}
