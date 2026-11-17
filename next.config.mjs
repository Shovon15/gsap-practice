/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow phones/tablets on the local network to load dev-server JS
  // (e.g. opening http://192.168.x.x:3000 on a mobile device).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
