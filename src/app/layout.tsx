import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Genie - India's AI Creator Studio",
  description: "A security-first, India-first AI creator workspace built for multilingual content and direct monetization.",
};

export const viewport: Viewport = {
  themeColor: "#0a0b16",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased selection:bg-purple-500/30">
        {children}
      </body>
    </html>
  );
}
