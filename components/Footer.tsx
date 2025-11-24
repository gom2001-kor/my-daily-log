"use client";

import { Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-8 text-center text-secondary text-sm border-t border-accent/20 mt-auto">
            <div className="flex flex-col items-center gap-2">
                <p className="flex items-center gap-1">
                    Made with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> by Daily Life
                </p>
                <p className="opacity-60">
                    &copy; {new Date().getFullYear()} 나만의 일상 기록. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
