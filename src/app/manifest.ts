import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "automation",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#16171B",
    theme_color: "#16171B",
    lang: "en-US",
  };
}
