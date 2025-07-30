/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // For server deployment on EC2
  images: {
    domains: ['example.com', '13.61.181.192'], // Add your image domains here
    unoptimized: true // For better compatibility on EC2
  },
  // API configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/:path*`
      }
    ];
  }
};

module.exports = nextConfig;