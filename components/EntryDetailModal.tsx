"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Clock } from "lucide-react";
import { DiaryEntry } from "@/context/DiaryContext";

interface EntryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    entry: DiaryEntry | null;
}

export default function EntryDetailModal({ isOpen, onClose, entry }: EntryDetailModalProps) {
    if (!entry) return null;

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
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-background w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-accent/20 max-h-[90vh] overflow-y-auto flex flex-col">

                            {/* Header Image (if available) */}
                            {entry.photos && entry.photos.length > 0 && (
                                <div className="relative w-full bg-black/5 flex items-center justify-center" style={{ maxHeight: '50vh' }}>
                                    <img
                                        src={entry.photos[0]}
                                        alt={entry.title}
                                        className="w-full h-auto max-h-[50vh] object-contain"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                                    <button
                                        onClick={onClose}
                                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors pointer-events-auto"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8 flex-1 overflow-y-auto">
                                {/* Header (if no image) */}
                                {(!entry.photos || entry.photos.length === 0) && (
                                    <div className="flex justify-end mb-4">
                                        <button
                                            onClick={onClose}
                                            className="p-2 hover:bg-muted rounded-full transition-colors text-secondary"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    </div>
                                )}

                                <div className="space-y-6">
                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-secondary/80">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{entry.date}</span>
                                        </div>
                                        {entry.time && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                <span>{entry.time}</span>
                                            </div>
                                        )}
                                        {entry.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                <span>{entry.location}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-3xl md:text-4xl font-bold text-primary tracking-tight leading-tight">
                                        {entry.title}
                                    </h2>

                                    {/* Body Text */}
                                    <div className="prose prose-lg prose-stone max-w-none text-secondary leading-relaxed whitespace-pre-wrap">
                                        {entry.content}
                                    </div>

                                    {/* Additional Photos */}
                                    {entry.photos && entry.photos.length > 1 && (
                                        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-accent/20">
                                            {entry.photos.slice(1).map((photo, index) => (
                                                <div key={index} className="rounded-xl overflow-hidden aspect-video">
                                                    <img
                                                        src={photo}
                                                        alt={`${entry.title} - ${index + 2}`}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
