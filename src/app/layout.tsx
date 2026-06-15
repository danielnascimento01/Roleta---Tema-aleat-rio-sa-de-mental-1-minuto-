import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roleta Serena | Geração Serena",
  description:
    "Máquina de ideias de conteúdo de saúde mental da Geração Serena. Gire a roleta, sorteie um tema e grave um Reels de 60 segundos.",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-white font-body text-[#0d2137] antialiased">
        {children}
      </body>
    </html>
  );
}
