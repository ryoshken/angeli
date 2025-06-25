import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello Geli!",
  description: "Start a study timer and bake some sweets!",
  keywords: "sugar, focus, study, timer, pixel art, retro",
  authors: [{ name: "Sugar & Focus" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <div className="custom-cursor"></div>
      </body>
    </html>
  );
}
