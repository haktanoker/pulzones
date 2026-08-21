import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulzones | Koşu Analizi",
  description: "Kişisel koşu ve nabız zone analizi",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header
          className="nav-glow-border sticky top-0 z-20 backdrop-blur-md"
          style={{ background: "rgba(8,9,15,0.8)" }}
        >
          <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-display text-sm tracking-wider"
            >
              <span
                className="w-2.5 h-2.5 rounded-full pulse-dot"
                style={{ background: "var(--pulse)" }}
              />
              <span style={{ letterSpacing: "0.12em" }}>PULZONES</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="btn-ghost">
                Panel
              </Link>
              <Link href="/ayarlar" className="btn-ghost">
                Ayarlar
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
