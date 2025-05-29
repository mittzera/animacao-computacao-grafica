// Production optimizations for Three.js
export const PRODUCTION_CONFIG = {
  // Renderer settings for production
  renderer: {
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
    precision: "mediump",
    stencil: false,
    depth: true,
    logarithmicDepthBuffer: false,
  },
  
  // Scene optimizations
  scene: {
    // Reduce shadow map size for better performance
    shadowMapSize: 1024,
    // Use simpler shadow type
    shadowType: "PCFSoftShadowMap",
    // Limit max lights
    maxLights: 3,
  },
  
  // Animation optimizations
  animation: {
    // Target 60fps but allow lower on mobile
    targetFPS: 60,
    // Use requestAnimationFrame throttling if needed
    throttle: false,
    // Reduce precision for calculations
    precision: 0.001,
  },
  
  // LOD (Level of Detail) settings
  lod: {
    // Enable automatic LOD switching
    enabled: true,
    // Distance thresholds
    distances: [0, 20, 50, 100],
    // Geometry complexity levels
    complexityLevels: [1.0, 0.7, 0.4, 0.2],
  },
}

// Check if running in production
export const isProduction = process.env.NODE_ENV === 'production'

// Get optimized config based on environment
export const getConfig = () => {
  if (isProduction) {
    return PRODUCTION_CONFIG
  }
  
  // Development config with higher quality
  return {
    ...PRODUCTION_CONFIG,
    renderer: {
      ...PRODUCTION_CONFIG.renderer,
      antialias: true,
      precision: "highp",
    },
    scene: {
      ...PRODUCTION_CONFIG.scene,
      shadowMapSize: 2048,
    },
  }
}
