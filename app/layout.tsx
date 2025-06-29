import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "./CustomCursor";

export const metadata: Metadata = {
  title: "Hello Geli!",
  description: "a letter to you",
  keywords: "geli",
  authors: [{ name: "migo" }],
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
        <CustomCursor />
      </body>
    </html>
  );
}
