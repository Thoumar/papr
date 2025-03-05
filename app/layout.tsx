import Head from "next/head";
import type { Metadata } from "next";

import "./globals.css";

import { Lexend } from "next/font/google";

import { PostHogProvider } from "./providers";

const lexend = Lexend({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Papr",
  icons: {
    icon: "/images/logo.png",
  },
  description: "The most simple productivity sheet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" sizes="any" href="/favicon.ico" />
      </Head>
      <body className={lexend.className}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
