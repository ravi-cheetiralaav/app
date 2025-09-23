import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kids Food Ordering - TKFC",
  description: "Holiday Food & Beverage Ordering System for Kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
