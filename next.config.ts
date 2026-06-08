import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

const nextConfig: NextConfig = {
  // Turbopack is the default builder in Next 16 — do not roll back to webpack.
};

// withContentCollections must be the outermost plugin. The cast pins the
// return type to NextConfig: the wrapper's own type declaration is slightly
// out of step with Next 16's interface (extra optional members on its end),
// which is a known nuisance with these pre-1.0 versions.
export default withContentCollections(nextConfig) as NextConfig;
