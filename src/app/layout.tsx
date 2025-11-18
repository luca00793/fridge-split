import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FridgeSplit",
  description: "Gestion de frigo partagé",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FridgeSplit",
  },
};

// Configuration mobile essentielle
export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // Empêche le zoom quand on clique sur un input
  userScalable: false, // Empêche le pinch-to-zoom
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-100 min-h-screen overscroll-none`}>
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden pb-20">
          {children}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}