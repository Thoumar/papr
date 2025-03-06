import { MetadataRoute } from "next";

const BASE_DOMAIN = "https://www.usepapr.co";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "/",
      priority: 1,
    },
  ].map((route) => {
    return {
      lastModified: new Date(),
      changeFrequency: "monthly",
      url: `${BASE_DOMAIN}${route.url}`,
    };
  });
}
