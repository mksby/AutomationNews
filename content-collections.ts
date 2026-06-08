import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import readingTime from "reading-time";
import rehypeShiki from "@shikijs/rehype";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const articleCategory = z.enum(["ai", "rpa", "industrial", "business-process", "policy"]);

const articles = defineCollection({
  name: "articles",
  directory: "content/articles",
  include: "**/*.mdx",
  schema: z.object({
    // slug is the URL contract — explicit, lowercased, hyphenated. Never derive
    // it from `title` at render time: the title can be edited; the URL cannot.
    slug: z
      .string()
      .regex(SLUG, "slug must be lowercase kebab-case (a-z, 0-9, hyphen) — it is the URL contract"),
    title: z.string().min(1).max(160),
    description: z.string().min(1).max(280),
    date: z.string().regex(ISO_DATE, "date must be an ISO-8601 date string"),
    updated: z.string().regex(ISO_DATE).optional(),
    category: articleCategory,
    tags: z.array(z.string().regex(SLUG)).default([]),
    author: z.string().regex(SLUG),
    draft: z.boolean().default(false),
    cover: z
      .object({
        src: z.string(),
        alt: z.string(),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
      .optional(),
    content: z.string(),
  }),
  transform: async (doc, context) => {
    const body = await compileMDX(context, doc, {
      rehypePlugins: [
        [
          rehypeShiki,
          {
            // Dual-theme output: Shiki emits both color values inline; the
            // CSS layer swaps via the [data-theme="light"] selector
            // (see prose styles in Stage 3).
            themes: { dark: "github-dark", light: "github-light" },
            defaultColor: false,
          },
        ],
      ],
    });

    const dateObj = new Date(doc.date);
    return {
      ...doc,
      body,
      url: `/posts/${doc.slug}`,
      year: dateObj.getUTCFullYear(),
      readingTime: Math.max(1, Math.round(readingTime(doc.content).minutes)),
    };
  },
});

const authors = defineCollection({
  name: "authors",
  directory: "content/authors",
  include: "*.yml",
  parser: "yaml",
  schema: z.object({
    slug: z.string().regex(SLUG),
    name: z.string().min(1),
    bio: z.string().optional(),
    url: z.string().url().optional(),
  }),
});

const categories = defineCollection({
  name: "categories",
  directory: "content/categories",
  include: "*.yml",
  parser: "yaml",
  schema: z.object({
    slug: articleCategory,
    name: z.string().min(1),
    description: z.string().min(1),
  }),
});

export default defineConfig({
  content: [articles, authors, categories],
});
