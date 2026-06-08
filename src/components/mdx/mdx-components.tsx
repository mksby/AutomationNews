import type { MDXComponents } from "mdx/types";
import { Callout } from "../layout/Callout";
import { Figure } from "../layout/Figure";

/**
 * Components available inside MDX articles. Plain HTML elements pick up
 * styling from `prose.module.scss` via the <Prose> wrapper, so this map
 * only needs to surface custom MDX-specific components (Callout, Figure)
 * and any overrides.
 */
export const mdxComponents: MDXComponents = {
  Callout,
  Figure,
};
