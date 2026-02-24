/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  output: 'export',
  basePath: '/roofextension',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
