import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FlowTime",
  description: "Organiza tu día con tareas, calendario y recordatorios por Telegram",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0A1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen" style={{ background: "var(--bg-base)" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
