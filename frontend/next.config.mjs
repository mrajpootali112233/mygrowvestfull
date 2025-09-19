/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react'],
  },
};

export default nextConfig;