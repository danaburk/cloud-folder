import type { Metadata } from "next";
import { Lora, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Cloud Folder",
  description: "Your textbooks and lectures, from any desktop.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lora.variable} ${inter.variable} ${plexMono.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
