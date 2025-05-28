import * as THREE from 'three'

export class VisualEffects {
  scene: THREE.Scene
  particles: THREE.Points[] = []
  
  constructor(scene: THREE.Scene) {
    this.scene = scene
  }

  // Efeito de poeira quando o personagem corre
  createRunningDust(position: THREE.Vector3) {
    const particleCount = 20
    const particles = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      particles[i] = position.x + (Math.random() - 0.5) * 0.5
      particles[i + 1] = 0.1 + Math.random() * 0.2
      particles[i + 2] = position.z + (Math.random() - 0.5) * 0.5
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3))
    
    const material = new THREE.PointsMaterial({
      color: 0x8B4513,
      size: 0.05,
      transparent: true,
      opacity: 0.6
    })
    
    const dustParticles = new THREE.Points(geometry, material)
    this.scene.add(dustParticles)
    this.particles.push(dustParticles)
    
    // Remove após 1 segundo
    setTimeout(() => {
      this.scene.remove(dustParticles)
      const index = this.particles.indexOf(dustParticles)
      if (index > -1) this.particles.splice(index, 1)
    }, 1000)
  }

  // Efeito de impacto no chute
  createKickImpact(position: THREE.Vector3) {
    // Círculo de impacto expandindo
    const ringGeometry = new THREE.RingGeometry(0.1, 0.3, 16)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    })
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial)
    ring.position.copy(position)
    ring.rotation.x = -Math.PI / 2
    this.scene.add(ring)
    
    // Animação de expansão
    let scale = 0.1
    const animate = () => {
      scale += 0.1
      ring.scale.setScalar(scale)
      ringMaterial.opacity = Math.max(0, 0.8 - scale * 0.2)
      
      if (scale < 5) {
        requestAnimationFrame(animate)
      } else {
        this.scene.remove(ring)
      }
    }
    animate()

    // Partículas de impacto
    this.createImpactParticles(position)
  }

  private createImpactParticles(position: THREE.Vector3) {
    const particleCount = 30
    const particles = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      particles[i] = position.x
      particles[i + 1] = position.y
      particles[i + 2] = position.z
      
      // Velocidades aleatórias
      velocities[i] = (Math.random() - 0.5) * 0.2
      velocities[i + 1] = Math.random() * 0.1
      velocities[i + 2] = (Math.random() - 0.5) * 0.2
    }
    
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3))
    
    const material = new THREE.PointsMaterial({
      color: 0xFFA500,
      size: 0.08,
      transparent: true,
      opacity: 1.0
    })
    
    const impactParticles = new THREE.Points(geometry, material)
    this.scene.add(impactParticles)
    
    // Animação das partículas
    let time = 0
    const animateParticles = () => {
      time += 0.016
      const positions = geometry.attributes.position.array as Float32Array
      
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] += velocities[i]
        positions[i + 1] += velocities[i + 1]
        positions[i + 2] += velocities[i + 2]
        
        // Aplicar gravidade
        velocities[i + 1] -= 0.005
      }
      
      geometry.attributes.position.needsUpdate = true
      material.opacity = Math.max(0, 1.0 - time * 2)
      
      if (time < 0.5) {
        requestAnimationFrame(animateParticles)
      } else {
        this.scene.remove(impactParticles)
      }
    }
    animateParticles()
  }

  // Efeito de trail da bola
  createBallTrail(startPosition: THREE.Vector3, endPosition: THREE.Vector3) {
    const points = []
    const segments = 20
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const point = new THREE.Vector3().lerpVectors(startPosition, endPosition, t)
      
      // Adicionar curvatura parabólica
      point.y += Math.sin(t * Math.PI) * 1.5
      points.push(point)
    }
    
    const curve = new THREE.CatmullRomCurve3(points)
    const tubeGeometry = new THREE.TubeGeometry(curve, 40, 0.02, 8, false)
    const tubeMaterial = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.6
    })
    
    const trail = new THREE.Mesh(tubeGeometry, tubeMaterial)
    this.scene.add(trail)
    
    // Fade out do trail
    let opacity = 0.6
    const fadeOut = () => {
      opacity -= 0.02
      tubeMaterial.opacity = opacity
      
      if (opacity > 0) {
        requestAnimationFrame(fadeOut)
      } else {
        this.scene.remove(trail)
      }
    }
    
    setTimeout(fadeOut, 500)
  }

  // Confete para celebração
  createCelebrationConfetti(position: THREE.Vector3) {
    const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF]
    
    for (let i = 0; i < 50; i++) {
      const geometry = new THREE.PlaneGeometry(0.1, 0.1)
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.8
      })
      
      const confetti = new THREE.Mesh(geometry, material)
      confetti.position.set(
        position.x + (Math.random() - 0.5) * 2,
        position.y + Math.random() * 3,
        position.z + (Math.random() - 0.5) * 2
      )
      
      // Rotação aleatória
      confetti.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      )
      
      this.scene.add(confetti)
      
      // Animação de queda
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        -0.05 - Math.random() * 0.05,
        (Math.random() - 0.5) * 0.1
      )
      
      const animateConfetti = () => {
        confetti.position.add(velocity)
        confetti.rotation.x += 0.1
        confetti.rotation.y += 0.1
        
        if (confetti.position.y > -2) {
          requestAnimationFrame(animateConfetti)
        } else {
          this.scene.remove(confetti)
        }
      }
      
      setTimeout(animateConfetti, Math.random() * 1000)
    }
  }

  // Limpar todas as partículas
  clearAllEffects() {
    this.particles.forEach(particle => {
      this.scene.remove(particle)
    })
    this.particles = []
  }
}
