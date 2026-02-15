/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'dev.to' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.hashnode.com' },
      { protocol: 'https', hostname: 'media.githubusercontent.com' },
    ],
  },
  webpack: (config) => {
    // Disable persistent webpack file cache to avoid corrupt pack files causing OOM
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
