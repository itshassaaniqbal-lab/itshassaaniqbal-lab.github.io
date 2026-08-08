import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Code N Site — Digital Products That Feel Alive",
  description:
    "Code N Site designs and engineers premium websites, software, AI experiences and digital systems for ambitious brands.",
  applicationName: "Code N Site",
  openGraph: {
    title: "Code N Site — Digital Products That Feel Alive",
    description:
      "Strategy, design and engineering for category-defining digital products.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1536,
        height: 1024,
        alt: "Code N Site cinematic robot identity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Code N Site — Digital Products That Feel Alive",
    description:
      "Strategy, design and engineering for category-defining digital products.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
