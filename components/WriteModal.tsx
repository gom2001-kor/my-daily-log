"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Image as ImageIcon, Loader2 } from "lucide-react";
import { useDiary } from "@/context/DiaryContext";
import { supabase } from "@/lib/supabaseClient";

interface WriteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WriteModal({ isOpen, onClose }: WriteModalProps) {
    const { addEntry } = useDiary();
    const [title, setTitle] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [content, setContent] = useState("");
    const [location, setLocation] = useState("");
    const [photos, setPhotos] = useState<string[]>([]); // Previews
    const [files, setFiles] = useState<File[]>([]); // Actual files to upload
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files;
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            setFiles(prev => [...prev, ...newFiles]);

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPhotos(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() || !title.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const uploadedPhotoUrls: string[] = [];

            // Upload images to Supabase Storage
            for (const file of files) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(filePath, file);

                if (uploadError) {
                    console.error('Error uploading image:', uploadError);
                    continue; // Skip failed uploads or handle error appropriately
                }

                const { data } = supabase.storage
                    .from('images')
                    .getPublicUrl(filePath);

                if (data) {
                    uploadedPhotoUrls.push(data.publicUrl);
                }
            }

            const now = new Date();
            await addEntry({
                title,
                date,
                time: now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                content,
                location,
                photos: uploadedPhotoUrls,
            });

            // Reset and close
            setTitle("");
            setDate(new Date().toISOString().split('T')[0]);
            setContent("");
            setLocation("");
            setPhotos([]);
            setFiles([]);
            onClose();
        } catch (error) {
            console.error("Error submitting entry:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="bg-background w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden pointer-events-auto border border-accent/20 max-h-[90vh] overflow-y-auto">
                            <div className="p-6 border-b border-accent/10 flex items-center justify-between sticky top-0 bg-background z-10">
                                <h2 className="text-xl font-light text-primary">새로운 기록</h2>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-muted rounded-full transition-colors text-secondary"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Title Input */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        제목
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="오늘의 하루에 제목을 붙여주세요"
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-secondary/40"
                                        required
                                    />
                                </div>

                                {/* Date Picker */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        날짜
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-none focus:ring-1 focus:ring-primary/20 transition-all text-secondary"
                                        required
                                    />
                                </div>

                                {/* Content Textarea */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        오늘의 이야기
                                    </label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="어떤 하루를 보내셨나요?"
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border-none focus:ring-1 focus:ring-primary/20 transition-all min-h-[150px] resize-none placeholder:text-secondary/40"
                                        required
                                    />
                                </div>

                                {/* Location Input */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        장소
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/50" />
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            placeholder="어디에 계셨나요?"
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-secondary/40"
                                        />
                                    </div>
                                </div>

                                {/* Photo Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-secondary mb-2">
                                        사진 추가
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('photo-upload')?.click()}
                                            className="w-full h-32 rounded-xl border-2 border-dashed border-secondary/20 flex flex-col items-center justify-center gap-2 text-secondary/50 hover:text-primary hover:border-primary/30 transition-all group"
                                        >
                                            <ImageIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            <span className="text-sm">사진을 선택해주세요</span>
                                        </button>
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                    </div>
                                    {photos.length > 0 && (
                                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                                            {photos.map((photo, index) => (
                                                <div key={index} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden group">
                                                    <img src={photo} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4 text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-8 py-3 bg-primary text-background rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                저장 중...
                                            </>
                                        ) : (
                                            "기록하기"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
