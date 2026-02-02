import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**"
      },
      {
        protocol: "https",
        hostname: "hutadev.vercel.app",
        port: "",
        pathname: "/**"
      }
    ]
  }
}

export default nextConfig
