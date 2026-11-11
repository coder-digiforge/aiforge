import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AIForge — AI Creation Workspace",
  description: "One workspace for writing, images, code, SEO and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}