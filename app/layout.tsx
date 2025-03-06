import Head from "next/head";

import "./globals.css";

import type { Metadata } from "next";
import { Lexend } from "next/font/google";

import PostHogWrapper from "./posthog/posthog-wrapper";

const lexend = Lexend({
  display: "swap",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Papr",
  creator: "Thoumar",
  generator: "Next.js",
  publisher: "Thoumar",
  applicationName: "Papr",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/logo.png",
  },
  metadataBase: new URL("https://usepapr.co"),
  robots: {
    index: true,
    follow: true,
  },
  description: "The most simple productivity sheet",
  alternates: {
    canonical: "https://usepapr.co",
  },
  authors: [
    {
      name: "Thoumar",
      url: "https://thoumar.com",
    },
  ],
  openGraph: {
    type: "website",
    title: "Papr",
    locale: "en_US",
    siteName: "Papr",
    url: "https://usepapr.co",
    description: "The most simple productivity sheet",
    images: [
      {
        width: 1200,
        height: 630,
        alt: "Papr",
        url: "https://usepapr.co/images/logo.png",
      },
    ],
  },
  keywords: [
    "productivity",
    "harvard timeboxing",
    "time boxing method",
    "brain dump technique",
    "priority management",
    "daily schedule planner",
    "time management tool",
    "productivity app",
    "task prioritization",
    "minimalist planner",
    "harvard business method",
    "todo list app",
    "time blocking",
    "focus technique",
    "productivity system",
    "digital planner",
    "time management app",
    "task scheduler",
    "work efficiency",
    "personal productivity",
    "time allocation",
    "simple productivity tool",
    "harvard productivity method",
    "goal setting app",
    "focus management",
    "mental clarity",
    "priority matrix",
    "timeboxing scheduler",
    "brain dump organizer",
    "top priorities tracker",
    "minimalist productivity",
    "task management",
    "time optimization",
    "daily planning",
    "work-life balance",
    "distraction-free planning",
    "efficient scheduling",
    "productivity technique",
    "digital todo list",
    "organized workflow",
    "time blocking app",
    "timeboxing productivity",
    "focused work sessions",
    "simple task manager",
    "harvard business school method",
    "productivity framework",
    "easy time management",
    "task organization",
    "professional productivity",
    "student productivity",
    "time management solution",
    "minimalist task manager",
    "productivity hack",
    "brain decluttering",
    "daily priorities",
  ],
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
        <PostHogWrapper>{children}</PostHogWrapper>
      </body>
    </html>
  );
}
