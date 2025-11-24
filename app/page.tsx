"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import CalendarView from "@/components/CalendarView";
import Timeline from "@/components/Timeline";
import Gallery from "@/components/Gallery";
import FloatingButton from "@/components/FloatingButton";
import WriteModal from "@/components/WriteModal";

export default function Home() {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  return (
    <div className="pb-20">
      <Hero />
      <CalendarView />
      <Timeline />
      <Gallery />
      <FloatingButton onClick={() => setIsWriteModalOpen(true)} />
      <WriteModal isOpen={isWriteModalOpen} onClose={() => setIsWriteModalOpen(false)} />
    </div>
  );
}
