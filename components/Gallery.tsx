"use client";

import { motion } from "framer-motion";
import { useDiary } from "@/context/DiaryContext";
import { useState } from "react";
import ImageLightbox from "./ImageLightbox";

export default function Gallery() {
    const { entries } = useDiary();
    const [selectedImage, setSelectedImage] = useState<{ src: string, alt: string } | null>(null);

    // Extract photos from entries
    const photos = entries.flatMap(entry =>
        entry.photos.map(photo => ({
            url: photo,
            entry: entry
        }))
    );

    if (photos.length === 0) return null;

    return (
        <section id="gallery" className="py-20 px-6 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <h2 className="text-2xl font-light text-primary mb-12 border-b border-accent/30 pb-4">
                    갤러리
                </h2>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {photos.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="break-inside-avoid rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
                            onClick={() => setSelectedImage({ src: item.url, alt: item.entry.title })}
                        >
                            <div className="relative overflow-hidden">
                                <img
                                    src={item.url}
                                    alt={`Gallery ${index}`}
                                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                    <p className="text-white text-sm font-medium truncate w-full">
                                        {item.entry.title}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <ImageLightbox
                isOpen={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                src={selectedImage?.src || null}
                alt={selectedImage?.alt}
            />
        </section>
    );
}
