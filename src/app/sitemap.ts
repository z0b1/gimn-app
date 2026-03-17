import type { MetadataRoute } from "next";

const baseUrl = "https://gimnapp.me";

const staticRoutes = [
  "",
  "/gimnazija-feed",
  "/vesti",
  "/glasanje",
  "/pitanja",
  "/kanali",
  "/pravila",
  "/hemija-26",
  "/o-nama",
  "/mapa",
  "/privatnost",
  "/uslovi-koriscenja",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
