/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'static-00.iconduck.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          pathname: '/**',
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  