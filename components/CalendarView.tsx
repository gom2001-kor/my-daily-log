"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useDiary } from "@/context/DiaryContext";

const days = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { entries } = useDiary();

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
        );
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    const renderDays = () => {
        const dayElements = [];
        for (let i = 0; i < firstDay; i++) {
            dayElements.push(<div key={`empty-${i}`} className="h-10 md:h-14" />);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${currentDate.getFullYear()}-${String(
                currentDate.getMonth() + 1
            ).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

            // Check if there are any entries for this date
            const hasEntry = entries.some((entry) => entry.date === dateStr);

            const isToday =
                new Date().toDateString() ===
                new Date(
                    currentDate.getFullYear(),
                    currentDate.getMonth(),
                    i
                ).toDateString();

            dayElements.push(
                <motion.div
                    key={i}
                    whileHover={{ scale: 1.1 }}
                    className={`h-10 md:h-14 flex items-center justify-center relative cursor-pointer rounded-full transition-colors ${isToday ? "bg-accent/30 text-primary font-bold" : "text-secondary hover:bg-muted"
                        }`}
                >
                    {i}
                    {hasEntry && (
                        <div className="absolute bottom-1 md:bottom-2 w-1 h-1 bg-primary rounded-full" />
                    )}
                </motion.div>
            );
        }
        return dayElements;
    };

    return (
        <section id="calendar" className="py-20 px-6 max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-light text-primary">
                        {currentDate.toLocaleString("ko-KR", {
                            month: "long",
                            year: "numeric",
                        })}
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-full hover:bg-muted transition-colors text-secondary"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-full hover:bg-muted transition-colors text-secondary"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
                    {days.map((day) => (
                        <div
                            key={day}
                            className="text-center text-xs uppercase tracking-widest text-secondary/60"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4">{renderDays()}</div>
            </motion.div>
        </section>
    );
}
