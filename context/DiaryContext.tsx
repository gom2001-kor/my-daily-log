"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

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
    addEntry: (entry: Omit<DiaryEntry, "id">) => void;
    deleteEntry: (id: string) => void;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export function DiaryProvider({ children }: { children: React.ReactNode }) {
    const [entries, setEntries] = useState<DiaryEntry[]>([]);

    // Load from localStorage on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        const saved = localStorage.getItem("diary-entries");
        if (saved) {
            try {
                setEntries(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse diary entries", e);
            }
        } else {
            // Initialize with some mock data if empty for demo purposes
            const mockData: DiaryEntry[] = [
                {
                    id: "1",
                    title: "여유로운 아침",
                    date: "2023-11-23",
                    time: "10:30 AM",
                    location: "카페 블루",
                    content: "따뜻한 커피 한 잔과 좋아하는 책으로 시작하는 아침. 창가로 들어오는 햇살이 참 좋았다.",
                    photos: ["https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=600&auto=format&fit=crop"]
                },
                {
                    id: "2",
                    title: "한강 산책",
                    date: "2023-11-22",
                    time: "06:15 PM",
                    location: "한강공원",
                    content: "해질 무렵의 한강은 언제나 아름답다. 선선한 바람을 맞으며 걷다 보니 복잡했던 마음이 정리되는 기분이다.",
                    photos: [
                        "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?q=80&w=600&auto=format&fit=crop"
                    ]
                },
                {
                    id: "3",
                    title: "비 오는 날",
                    date: "2023-11-20",
                    time: "02:00 PM",
                    location: "집",
                    content: "창밖으로 들리는 빗소리가 좋아서 하루 종일 집에서 뒹굴거렸다. 가끔은 이런 게으름도 필요해.",
                    photos: ["https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=600&auto=format&fit=crop"]
                }
            ];
            setEntries(mockData);
            localStorage.setItem("diary-entries", JSON.stringify(mockData));
        }
    }, []);

    // Save to localStorage whenever entries change
    useEffect(() => {
        if (entries.length > 0) {
            localStorage.setItem("diary-entries", JSON.stringify(entries));
        }
    }, [entries]);

    const addEntry = (newEntry: Omit<DiaryEntry, "id">) => {
        const entry: DiaryEntry = {
            ...newEntry,
            id: crypto.randomUUID(),
        };
        setEntries((prev) => [entry, ...prev]);
    };

    const deleteEntry = (id: string) => {
        setEntries((prev) => prev.filter((entry) => entry.id !== id));
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
