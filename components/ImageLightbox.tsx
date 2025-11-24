"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ImageLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    src: string | null;
    alt?: string;
}

export default function ImageLightbox({ isOpen, onClose, src, alt }: ImageLightboxProps) {
    if (!src) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] cursor-pointer"
                    />

                    {/* Lightbox Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative max-w-[90vw] max-h-[90vh] pointer-events-auto">
                            <img
                                src={src}
                                alt={alt || "Lightbox image"}
                                className="w-full h-full object-contain max-h-[90vh] rounded-lg shadow-2xl"
                            />

                            <button
                                onClick={onClose}
                                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
