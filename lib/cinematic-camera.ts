import * as THREE from 'three'

export class CinematicCamera {
  camera: THREE.PerspectiveCamera
  defaultPosition: THREE.Vector3
  defaultTarget: THREE.Vector3
  
  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera
    this.defaultPosition = new THREE.Vector3(0, 2, 5)
    this.defaultTarget = new THREE.Vector3(0, 1, 0)
  }

  // Diferentes ângulos de câmera para cada fase da animação
  updateCameraForPhase(phase: number, time: number, characterPosition: THREE.Vector3) {
    const smoothTime = this.easeInOut(time)
    
    if (phase < 0.3) {
      // Phase 1: Câmera lateral seguindo o personagem
      const targetPos = new THREE.Vector3(
        -3 + Math.sin(time * 2) * 0.5, // Movimento sutil lateral
        2.5,
        characterPosition.z + 3
      )
      const lookAt = new THREE.Vector3(characterPosition.x, 1, characterPosition.z)
      
      this.smoothMoveTo(targetPos, lookAt, 0.05)
      
    } else if (phase < 0.5) {
      // Phase 2: Câmera se posicionando para o chute
      const targetPos = new THREE.Vector3(2, 1.5, 2)
      const lookAt = new THREE.Vector3(0, 0.5, 0.5)
      
      this.smoothMoveTo(targetPos, lookAt, 0.08)
      
    } else if (phase < 0.7) {
      // Phase 3: Câmera dramática para o chute
      const kickProgress = (phase - 0.5) / 0.2
      
      if (kickProgress < 0.5) {
        // Close-up da perna
        const targetPos = new THREE.Vector3(1, 0.8, 1.5)
        const lookAt = new THREE.Vector3(0.3, 0.2, 1)
        this.smoothMoveTo(targetPos, lookAt, 0.1)
      } else {
        // Seguir a bola
        const ballProgress = (kickProgress - 0.5) * 2
        const ballZ = 2 - ballProgress * 10
        const targetPos = new THREE.Vector3(3, 3, ballZ + 2)
        const lookAt = new THREE.Vector3(0, 1, ballZ)
        this.smoothMoveTo(targetPos, lookAt, 0.06)
      }
      
    } else {
      // Phase 4: Câmera de celebração
      const celebrationProgress = (phase - 0.7) / 0.3
      const angle = celebrationProgress * Math.PI * 2
      
      const radius = 4
      const targetPos = new THREE.Vector3(
        Math.cos(angle) * radius,
        2.5 + Math.sin(time * 3) * 0.3,
        Math.sin(angle) * radius
      )
      const lookAt = new THREE.Vector3(0, 1, 0)
      
      this.smoothMoveTo(targetPos, lookAt, 0.03)
    }
  }

  private smoothMoveTo(targetPosition: THREE.Vector3, lookAt: THREE.Vector3, speed: number) {
    // Interpolar suavemente para a nova posição
    this.camera.position.lerp(targetPosition, speed)
    
    // Calcular direção do olhar e interpolar
    const currentTarget = new THREE.Vector3()
    this.camera.getWorldDirection(currentTarget)
    currentTarget.add(this.camera.position)
    
    currentTarget.lerp(lookAt, speed)
    this.camera.lookAt(currentTarget)
  }

  private easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  reset() {
    this.camera.position.copy(this.defaultPosition)
    this.camera.lookAt(this.defaultTarget)
  }
}
