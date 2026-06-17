/** @format */

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  // ali-oss 依赖 proxy-agent 等 Node.js 原生模块，不能被 Next.js 打包，需在运行时直接加载
  serverExternalPackages: ['ali-oss', 'urllib', 'sharp'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.aliyuncs.com',
      },
    ],
  },
  typedRoutes: true,
}

export default nextConfig
