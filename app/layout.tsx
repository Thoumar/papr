import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumen",
  description: "Your go to productivity sheet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body className={lexend.className}>{children}</body>
    </html>
  );
}
