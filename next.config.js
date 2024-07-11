/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
    ],
},
}

module.exports = nextConfig
