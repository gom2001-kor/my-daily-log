"use client";

import { motion } from "framer-motion";
import { PenTool } from "lucide-react";

interface FloatingButtonProps {
    onClick: () => void;
}

export default function FloatingButton({ onClick }: FloatingButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Write new entry"
            className="fixed bottom-8 right-8 z-40 w-14 h-14 bg-primary text-background rounded-full shadow-lg flex items-center justify-center hover:bg-foreground transition-colors"
        >
            <PenTool className="w-6 h-6" />
        </motion.button>
    );
}
