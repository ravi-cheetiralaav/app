/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: this app uses server-side API routes (NextAuth) and a server-side SQLite DB.
  // Static HTML export mode (`output: 'export'`) is incompatible with those features,
  // so we do not enable `output: 'export'` here.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Base path will be automatically configured by GitHub Pages action if needed
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : undefined,
};

module.exports = nextConfig