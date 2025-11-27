"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface DiaryEntry {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    content: string;
    photos: string[];
    location?: string;
    time?: string;
}

interface DiaryContextType {
    entries: DiaryEntry[];
    addEntry: (entry: Omit<DiaryEntry, "id">) => Promise<void>;
    deleteEntry: (id: string) => Promise<void>;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export function DiaryProvider({ children }: { children: React.ReactNode }) {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);

    const fetchEntries = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('date', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching entries:', error);
        } else {
            const formattedData = data?.map(post => ({
                id: post.id,
                title: post.title,
                date: post.date,
                time: post.time,
                content: post.content,
                location: post.location,
                photos: post.image_url ? [post.image_url] : []
            })) || [];

            setEntries(formattedData);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const addEntry = async (newEntry: Omit<DiaryEntry, "id">) => {
        const imageUrl = newEntry.photos.length > 0 ? newEntry.photos[0] : null;

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: newEntry.title,
                    date: newEntry.date,
                    time: newEntry.time,
                    content: newEntry.content,
                    location: newEntry.location,
                    image_url: imageUrl
                }
            ])
            .select();

        if (error) {
            console.error('Error adding entry:', error);
        } else {
            if (data) {
                const insertedPost = data[0];
                const newDiaryEntry: DiaryEntry = {
                    id: insertedPost.id,
                    title: insertedPost.title,
                    date: insertedPost.date,
                    time: insertedPost.time,
                    content: insertedPost.content,
                    location: insertedPost.location,
                    photos: insertedPost.image_url ? [insertedPost.image_url] : []
                };

                setEntries((prev) => {
                    const updated = [newDiaryEntry, ...prev];
                    return updated.sort((a, b) => {
                        const dateA = new Date(a.date).getTime();
                        const dateB = new Date(b.date).getTime();
                        if (dateA !== dateB) {
                            return dateB - dateA; // Descending date
                        }
                        // Secondary sort by time if available
                        if (a.time && b.time) {
                            return b.time.localeCompare(a.time);
                        }
                        return 0;
                    });
                });
            }
        }
    };

    const deleteEntry = async (id: string) => {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting entry:', error);
        } else {
            setEntries((prev) => prev.filter((entry) => entry.id !== id));
        }
    };

    return (
        <DiaryContext.Provider value={{ entries, addEntry, deleteEntry }}>
            {children}
        </DiaryContext.Provider>
    );
}

export function useDiary() {
    const context = useContext(DiaryContext);
    if (context === undefined) {
        throw new Error("useDiary must be used within a DiaryProvider");
    }
    return context;
}
