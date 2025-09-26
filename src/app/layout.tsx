import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TKFC - Kids' Holiday Food & Beverages",
  description: "A fun and educational platform for kids to run their own food & beverage ordering business",
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
