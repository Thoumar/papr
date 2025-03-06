"use client";

import { ReactNode } from "react";

import dynamic from "next/dynamic";

const PostHogClient = dynamic(
  () => import("./posthog-client").then((mod) => mod.PostHogClient),
  { ssr: false }
);

export default function PostHogWrapper({ children }: { children: ReactNode }) {
  return <PostHogClient>{children}</PostHogClient>;
}
