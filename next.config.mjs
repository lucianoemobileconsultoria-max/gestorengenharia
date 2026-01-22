/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `http://127.0.0.1:3400/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
