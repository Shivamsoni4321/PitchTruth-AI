import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "PitchTruth AI",
  description:
    "AI that explains how temporary World Cup grass affects ball speed, injuries, and tactical fairness."
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
