import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "PitchTruth AI",
  description:
    "AI that explains how World Cup pitch conditions affect ball speed, player safety, and tactical fairness."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-[var(--font-body)] antialiased">{children}</body>
    </html>
  );
}
