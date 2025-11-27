"use client";

import { motion } from "framer-motion";
import { useDiary, DiaryEntry } from "@/context/DiaryContext";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import EntryDetailModal from "./EntryDetailModal";

export default function Timeline() {
    const { entries, deleteEntry } = useDiary();
    const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);

    if (entries.length === 0) {
        return (
            <section id="timeline" className="py-20 px-6 max-w-3xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-secondary"
                >
                    <p className="text-lg font-light mb-2">아직 기록이 없습니다.</p>
                    <p className="text-sm opacity-60">펜 버튼을 눌러 첫 번째 추억을 기록해보세요.</p>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="timeline" className="py-20 px-6 max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-light text-primary mb-12 border-b border-accent/30 pb-4">
                    타임라인
                </h2>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-accent before:to-transparent">
                    {entries.map((entry, index) => (
                        <div key={entry.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-accent bg-background shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <span className="w-3 h-3 bg-primary rounded-full" />
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-accent/10 shadow-sm hover:shadow-md transition-all cursor-pointer relative group/card"
                                onClick={() => setSelectedEntry(entry)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <time className="text-sm font-medium text-primary/80">
                                        {entry.date}
                                        {entry.time && <span className="opacity-60"> • {entry.time}</span>}
                                    </time>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('정말 삭제하시겠습니까?')) deleteEntry(entry.id);
                                        }}
                                        className="text-secondary/40 hover:text-red-500 transition-colors p-1 opacity-0 group-hover/card:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-medium text-primary mb-2">{entry.title}</h3>
                                <p className="text-secondary line-clamp-3 leading-relaxed text-sm">
                                    {entry.content}
                                </p>
                                {entry.photos && entry.photos.length > 0 && (
                                    <div className="mt-4 rounded-lg overflow-hidden h-32 w-full relative">
                                        <img src={entry.photos[0]} alt="" className="w-full h-full object-cover" />
                                        {entry.photos.length > 1 && (
                                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                                +{entry.photos.length - 1}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <EntryDetailModal
                isOpen={!!selectedEntry}
                onClose={() => setSelectedEntry(null)}
                entry={selectedEntry}
            />
        </section>
    );
}
