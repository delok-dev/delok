import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Delok",
    short_name: "Delok",
    description: "Delok is a log monitoring platform for monitoring application logs.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#5B5BF6",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
