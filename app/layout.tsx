import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DiaryProvider } from "@/context/DiaryContext";
import SeasonalBackground from "@/components/SeasonalBackground";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: {
    template: "%s | 나의 소소한 일상 (My Daily Log)",
    default: "나의 소소한 일상 (My Daily Log)",
  },
  description: "소중한 하루와 추억을 사진과 글로 기록하는 나만의 공간입니다.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📔</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${notoSansKr.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <DiaryProvider>
          <SeasonalBackground />
          <Header />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </DiaryProvider>
      </body>
    </html>
  );
}
