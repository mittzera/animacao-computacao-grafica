/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  experimental: {
    // Optimize for static export if needed
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei']
  },
  
  // Webpack optimization for Three.js
  webpack: (config, { isServer }) => {
    // Optimize Three.js imports
    config.externals = config.externals || {}
    
    if (!isServer) {
      // Client-side optimizations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return config
  },

  // Performance optimizations
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Static optimization
  trailingSlash: false,
  
  // Image optimization (if needed later)
  images: {
    unoptimized: false,
    domains: [],
  },
}

module.exports = nextConfig
