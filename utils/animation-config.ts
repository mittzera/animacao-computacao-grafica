/**
 * Configurações da Animação
 * Centraliza todos os parâmetros ajustáveis da animação
 */

export const ANIMATION_CONFIG = {
  // Duração total e fases
  TOTAL_DURATION: 18, // segundos
  PHASES: {
    RUN: { start: 0, end: 0.3 },      // 0-5.4s (30% do tempo)
    PREPARE: { start: 0.3, end: 0.5 }, // 5.4-9s (20% do tempo)
    KICK: { start: 0.5, end: 0.7 },   // 9-12.6s (20% do tempo)
    CELEBRATE: { start: 0.7, end: 1.0 } // 12.6-18s (30% do tempo)
  },

  // Parâmetros de movimento
  MOVEMENT: {
    RUN_SPEED: 3,           // Velocidade da animação de corrida
    WALK_SWING: 0.5,        // Amplitude do balanço das pernas
    ARM_SWING: 0.3,         // Amplitude do balanço dos braços
    JUMP_HEIGHT: 0.3,       // Altura do pulo na comemoração
    CELEBRATION_SPEED: 4    // Velocidade da animação de comemoração
  },

  // Configurações IK
  IK: {
    ITERATIONS: 10,         // Número de iterações do solver
    TARGET_POSITIONS: {
      PREPARE_X: 0.3,
      PREPARE_Z_START: 1.2,
      PREPARE_Z_END: 0.5
    }
  },

  // Configurações Hinge Joints
  HINGES: {
    KNEE: {
      MIN_ANGLE: 0,
      MAX_ANGLE: Math.PI
    },
    ELBOW: {
      MIN_ANGLE: -Math.PI / 2,
      MAX_ANGLE: Math.PI / 2
    },
    KICK_INTENSITY: 8       // Multiplicador da intensidade do chute
  },

  // Posições dos objetos
  POSITIONS: {
    CHARACTER_START_Z: 2,
    BALL_START: { x: 0, y: 0.15, z: 2 },
    BALL_END_DISTANCE: 10,
    BALL_HEIGHT_MULTIPLIER: 2,
    GOAL_POSITION: { x: 0, y: 1, z: -8 }
  },

  // Configurações visuais
  VISUALS: {
    FIELD_SIZE: 20,
    BALL_RADIUS: 0.15,
    CHARACTER_COLOR: 0xffa500,
    FIELD_COLOR: 0x00AA00,
    SHADOW_MAP_SIZE: 2048
  }
}

// Funções utilitárias para cálculos de animação
export const ANIMATION_UTILS = {
  // Interpola entre dois valores
  lerp: (start: number, end: number, t: number) => {
    return start + (end - start) * t
  },

  // Função ease-in-out para transições suaves
  easeInOut: (t: number) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },

  // Calcula fase normalizada (0-1) dentro de um intervalo
  getPhaseProgress: (globalTime: number, phase: { start: number, end: number }) => {
    const duration = phase.end - phase.start
    const progress = (globalTime - phase.start) / duration
    return Math.max(0, Math.min(1, progress))
  },

  // Função de onda suavizada
  smoothWave: (time: number, frequency: number = 1, amplitude: number = 1) => {
    return Math.sin(time * frequency) * amplitude
  }
}

// Configurações específicas para cada tipo de animação
export const ANIMATION_PRESETS = {
  WALKING: {
    legSwing: 0.5,
    armSwing: 0.3,
    speed: 3,
    stepHeight: 0.1
  },
  
  RUNNING: {
    legSwing: 0.8,
    armSwing: 0.5,
    speed: 5,
    stepHeight: 0.2
  },
  
  CELEBRATION: {
    armRaise: 0.5,
    jumpHeight: 0.3,
    frequency: 2
  },
  
  KICK: {
    backswing: 0.6,
    forward: 1.2,
    speed: 8
  }
}
