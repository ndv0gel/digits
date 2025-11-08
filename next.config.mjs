/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('argon2'); // Externalize argon2
    }
    return config;
  },
};

export default nextConfig;
