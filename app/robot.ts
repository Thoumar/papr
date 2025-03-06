import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    sitemap: "https://usepapr.co/sitemap.xml",
    rules: [
      {
        disallow: ["/"],
        userAgent: "Unnecessarybot",
      },
      {
        allow: ["/"],
        userAgent: "*",
      },
    ],
  };
}
