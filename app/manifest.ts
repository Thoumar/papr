import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "papr",
    dir: "auto",
    name: "Papr",
    lang: "en-US",
    start_url: "/",
    short_name: "Papr",
    theme_color: "#fff",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff",
    categories: ["productivity"],
    description: "The most simple productivity sheet",
    icons: [
      {
        type: "image/png",
        sizes: "any",
        src: "/images/logo.png",
      },
    ],
  };
}
