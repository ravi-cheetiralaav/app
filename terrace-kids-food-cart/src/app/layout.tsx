import type { Metadata } from "next";
import { Inter, Comic_Neue } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-comic-neue",
});

export const metadata: Metadata = {
  title: "Terrace Kids Food Cart - Holiday Food & Beverage Ordering",
  description: "A fun and educational platform for kids to run their holiday food & beverage project",
  keywords: "kids, food cart, holiday, education, ordering system",
  authors: [{ name: "Terrace Kids Food Cart" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/TKFC-5.jpg" />
      </head>
      <body className={`${inter.variable} ${comicNeue.variable} antialiased`}>
        <Providers>
          {children}
          {/* Footer inserted site-wide */}
          <footer style={{
            marginTop: 48,
            padding: '24px 12px',
            textAlign: 'center',
            color: 'rgba(0,0,0,0.7)'
          }}>
            <div style={{ fontSize: 14, marginBottom: 6 }}>
              Teaching Kids Food & Customer service 👨‍🍳👩‍🍳
            </div>
            <div style={{ fontSize: 13 }}>
              Made with ❤️ by kids, for the community
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
