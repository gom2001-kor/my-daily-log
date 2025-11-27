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
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching entries:', error);
        } else {
            // Map Supabase data to DiaryEntry format if needed
            // Assuming Supabase columns match DiaryEntry fields exactly or close enough
            // We might need to handle 'photos' if it's stored differently (e.g. JSON or array)
            // For now assuming 'photos' is a text array or JSON in Supabase
            // And 'image_url' from user request might be mapped to photos[0] or similar?
            // User request said: "Save that URL into the `image_url` column".
            // So the table likely has `image_url` (text) instead of `photos` (array).
            // Let's adapt to that.

            const formattedData = data?.map(post => ({
                id: post.id,
                title: post.title,
                date: post.date,
                time: post.time,
                content: post.content,
                location: post.location,
                photos: post.image_url ? [post.image_url] : [] // Map image_url to photos array for UI compatibility
            })) || [];

            setEntries(formattedData);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    const addEntry = async (newEntry: Omit<DiaryEntry, "id">) => {
        // We will handle the actual DB insertion here.
        // Note: WriteModal will handle image upload and pass the URL in 'photos' or we need to change the interface.
        // The user said: "Modify the "Write Modal" to INSERT new data...".
        // But usually Context handles the logic.
        // Let's keep addEntry as the interface to add data.
        // If WriteModal does the insert directly, then addEntry might just be for local state update?
        // User request: "Modify the "Write Modal" to INSERT new data into the `posts` table when I click Save."
        // This implies WriteModal might do the heavy lifting or call a context function that does it.
        // I will implement `addEntry` to do the Supabase insert for cleaner separation, 
        // or if WriteModal does it, `addEntry` could just refresh the list.

        // Let's stick to Context doing the data manipulation to keep UI clean.
        // But wait, WriteModal needs to upload image first.

        // Let's assume addEntry takes the fully prepared data (including image URL if any).
        // The `photos` array in `newEntry` will contain the URL if uploaded.

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
                setEntries((prev) => [newDiaryEntry, ...prev]);
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
