import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FeedFlow — Personalized Feed Simulator",
  description: "Visualize LRU/FIFO/Optimal cache algorithms and personalized news feed ranking in real time.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
