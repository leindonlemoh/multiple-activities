/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["zbmzxmtefpwsfevrmdfq.supabase.co"], // Just the hostname
  },
  eslint: {
    ignoreDuringBuilds: true, // This disables ESLint during build time
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
