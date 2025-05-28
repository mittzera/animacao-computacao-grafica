'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { CharacterRig } from '@/lib/character-rig'

interface FootballAnimationProps {
  onAnimationComplete?: () => void
}

const FootballAnimationFixed: React.FC<FootballAnimationProps> = ({ onAnimationComplete }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const characterRef = useRef<CharacterRig>()
  const ballRef = useRef<THREE.Mesh>()
  const animationIdRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [animationTime, setAnimationTime] = useState(0)
  const [currentPhase, setCurrentPhase] = useState('Preparando...')
  
  // Effect triggers
  const kickEffectTriggered = useRef(false)

  // Animation function - simplified and working
  const animate = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !characterRef.current || !ballRef.current) {
      return
    }

    if (!isPlaying) {
      return
    }

    // Calculate elapsed time
    const currentTime = performance.now()
    const elapsedTime = (currentTime - startTimeRef.current) / 1000
    setAnimationTime(elapsedTime * 1000)
    
    const character = characterRef.current
    const ball = ballRef.current
      // Total duration: 18 seconds 
    const totalDuration = 18
    let currentPhaseText = 'Preparando...'
      if (elapsedTime < 8) {
      // Phase 1: Running out and back (0-8s)
      currentPhaseText = 'Correndo ida e volta (FK)'
      
      const runTime = elapsedTime * 3
      const halfTime = 4 // 4 seconds out, 4 seconds back
      
      const rightThigh = character.getBone('rightThigh')
      const leftThigh = character.getBone('leftThigh')
      const rightShin = character.getBone('rightShin')
      const leftShin = character.getBone('leftShin')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      
      if (rightThigh) rightThigh.rotation.x = Math.sin(runTime) * 0.5
      if (leftThigh) leftThigh.rotation.x = -Math.sin(runTime) * 0.5
      if (rightShin) rightShin.rotation.x = Math.max(0, Math.sin(runTime + 0.5)) * 0.3
      if (leftShin) leftShin.rotation.x = Math.max(0, -Math.sin(runTime + 0.5)) * 0.3
      if (rightArm) rightArm.rotation.x = -Math.sin(runTime) * 0.3
      if (leftArm) leftArm.rotation.x = Math.sin(runTime) * 0.3
      
      // Move character: out for 4s, then back for 4s
      if (elapsedTime <= halfTime) {
        // Going out - move away from ball
        character.getMesh().position.z = -elapsedTime * 0.8 // Slower, shorter distance
      } else {
        // Coming back - return to starting position
        const returnTime = elapsedTime - halfTime
        const maxDistance = halfTime * 0.8 // Maximum distance reached
        character.getMesh().position.z = -maxDistance + (returnTime * 0.8) // Return at same speed
      }        } else if (elapsedTime < 11) {
      // Phase 2: Kick preparation (8-11s)
      currentPhaseText = 'Preparando chute (IK)'
      
      const prepTime = (elapsedTime - 8) / 3 // 0 to 1 over preparation duration
      
      const leftThigh = character.getBone('leftThigh')
      const leftShin = character.getBone('leftShin')
      const rightThigh = character.getBone('rightThigh')
      const rightShin = character.getBone('rightShin')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      
      // Character should be back near starting position (around z=0)
      character.getMesh().position.z = 0
      
      // Gradual transition to preparation stance
      const prepareGrow = Math.min(1, prepTime * 1.5) // Fade in preparation
      
      // Support leg positioning with smooth transition
      if (leftThigh) leftThigh.rotation.x = -0.2 * prepareGrow
      if (leftShin) leftShin.rotation.x = 0.1 * prepareGrow
      
      // Kicking leg preparation with smooth transition  
      if (rightThigh) rightThigh.rotation.x = -0.3 * prepareGrow
      if (rightShin) rightShin.rotation.x = 0.2 * prepareGrow
      
      // Arms for balance
      if (rightArm) rightArm.rotation.x = -0.5 * prepareGrow
      if (leftArm) leftArm.rotation.x = 0.5 * prepareGrow
      
      // Small bobbing movement
      const bobbing = Math.sin(elapsedTime * 4) * 0.02 * prepareGrow
      character.getMesh().position.y = bobbing
        } else if (elapsedTime < 14) {
      // Phase 3: Kicking (11-14s)
      currentPhaseText = 'Chutando (FK Direto)'
      
      const kickTime = elapsedTime - 11
      const kickDuration = 3
      const kickPhase = kickTime / kickDuration // 0 to 1
      
      // Character stays at starting position for kick
      character.getMesh().position.z = 0
      
      // Strong kick animation with better curves
      const kickCurve = Math.sin(kickPhase * Math.PI) // 0 to 1 to 0 smooth curve
      const kickAngle = kickCurve * 1.8
      
      console.log(`KICK: time=${kickTime.toFixed(2)}, phase=${kickPhase.toFixed(3)}, angle=${kickAngle.toFixed(3)}`)
      
      const rightThigh = character.getBone('rightThigh')
      const rightShin = character.getBone('rightShin')
      const leftThigh = character.getBone('leftThigh')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      const spine = character.getBone('spine')
      
      // Main kicking leg motion
      if (rightThigh) {
        rightThigh.rotation.x = kickAngle
        rightThigh.rotation.z = kickPhase * 0.3
      }
      if (rightShin) {
        rightShin.rotation.x = Math.max(0, kickAngle * 0.9)
      }
      
      // Support leg - more stable
      if (leftThigh) {
        leftThigh.rotation.x = -0.2 - kickPhase * 0.2
      }
      
      // Body movement
      if (spine) {
        spine.rotation.x = kickPhase * 0.4
        spine.rotation.z = kickPhase * 0.2
      }
      
      // Arms
      if (rightArm) {
        rightArm.rotation.x = -0.8 - kickAngle * 0.5
        rightArm.rotation.z = kickPhase * 0.4
      }      if (leftArm) {
        leftArm.rotation.x = 0.8 + kickAngle * 0.4
        leftArm.rotation.z = -kickPhase * 0.3
      }
      
      // Ball movement - trigger at 90% of kick when foot is at peak contact
      if (kickPhase > 0.9 && !kickEffectTriggered.current) {
        console.log('BALL KICK TRIGGERED!')
        kickEffectTriggered.current = true
      }
      
      // Ball stays in place until kicked, then flies
      if (kickEffectTriggered.current) {
        const ballKickTime = 11 + (kickDuration * 0.9) // When ball was actually kicked
        const ballFlightTime = Math.max(0, elapsedTime - ballKickTime)
          if (ballFlightTime >= 0) {
          const vx = 2, vy = 8, vz = 15
          const gravity = -9.8
          
          // Ball starts from position near character's foot when kicked
          const startX = 0.2 // Slightly to the right where the foot would be
          const startY = 0.15 
          const startZ = 1.2 // Closer to character
          
          const newX = startX + vx * ballFlightTime
          const newY = Math.max(0.15, startY + vy * ballFlightTime + 0.5 * gravity * ballFlightTime * ballFlightTime)
          const newZ = startZ + vz * ballFlightTime
          
          ball.position.set(newX, newY, newZ)
          console.log(`Ball flying: ${newX.toFixed(2)}, ${newY.toFixed(2)}, ${newZ.toFixed(2)}`)
        }
      } else {
        // Ball stays in original position until kicked
        ball.position.set(0, 0.15, 2)
      }
        } else {
      // Phase 4: Celebration (14-18s)
      currentPhaseText = 'Comemorando (FK + IK)'
      
      const celebTime = elapsedTime * 2
      
      const spine = character.getBone('spine')
      const head = character.getBone('head')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      
      if (spine) spine.rotation.z = Math.sin(celebTime) * 0.2
      if (head) head.rotation.y = Math.sin(celebTime * 1.5) * 0.3
      
      if (rightArm) {
        rightArm.rotation.z = Math.PI * 0.3 + Math.sin(celebTime) * 0.2
        rightArm.rotation.x = Math.sin(celebTime * 0.5) * 0.1
      }
      if (leftArm) {
        leftArm.rotation.z = -Math.PI * 0.3 - Math.sin(celebTime) * 0.2
        leftArm.rotation.x = Math.sin(celebTime * 0.5) * 0.1
      }
    }
    
    setCurrentPhase(currentPhaseText)
    
    // Render
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    // Continue or stop
    if (elapsedTime >= totalDuration) {
      setIsPlaying(false)
      if (onAnimationComplete) {
        onAnimationComplete()
      }
    } else {
      animationIdRef.current = requestAnimationFrame(animate)
    }
  }, [isPlaying, onAnimationComplete])

  useEffect(() => {
    if (!mountRef.current) return

    console.log('Setting up scene...')

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87CEEB)
    sceneRef.current = scene

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 2, 5)
    camera.lookAt(0, 1, 0)
    cameraRef.current = camera

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mountRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Create field
    const fieldGeometry = new THREE.PlaneGeometry(20, 15)
    const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 })
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial)
    field.rotation.x = -Math.PI / 2
    field.receiveShadow = true
    scene.add(field)

    // Create character
    const character = new CharacterRig()
    scene.add(character.getMesh())
    characterRef.current = character
    
    console.log('Character created with bones:', Object.keys(character.bones))

    // Create ball
    const ballGeometry = new THREE.SphereGeometry(0.15, 32, 32)
    const ballMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      shininess: 100,
      specular: 0x111111
    })
    const ball = new THREE.Mesh(ballGeometry, ballMaterial)
    ball.position.set(0, 0.15, 2)
    ball.castShadow = true
    scene.add(ball)
    ballRef.current = ball

    console.log('Scene setup complete')

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  // Animation control effect
  useEffect(() => {
    if (isPlaying && !animationIdRef.current) {
      console.log('Starting animation...')
      animate()
    } else if (!isPlaying && animationIdRef.current) {
      console.log('Stopping animation...')
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }
  }, [isPlaying, animate])

  const startAnimation = () => {
    console.log('Start button clicked')
    setIsPlaying(true)
    setAnimationTime(0)
    startTimeRef.current = performance.now()
    kickEffectTriggered.current = false
  }

  const stopAnimation = () => {
    console.log('Stop button clicked')
    setIsPlaying(false)
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }
  }

  const resetAnimation = () => {
    console.log('Reset button clicked')
    stopAnimation()
    setAnimationTime(0)
    setCurrentPhase('Preparando...')
    kickEffectTriggered.current = false
    
    if (characterRef.current) {
      characterRef.current.getMesh().position.set(0, 0, 0)
      
      try {
        Object.values(characterRef.current.bones).forEach(bone => {
          bone.rotation.set(0, 0, 0)
        })
      } catch (error) {
        console.warn('Could not reset bone rotations:', error)
      }
    }
    
    if (ballRef.current) {
      ballRef.current.position.set(0, 0.15, 2)
    }
    
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 2, 5)
      cameraRef.current.lookAt(0, 1, 0)
    }
    
    // Render one frame to show reset state
    if (sceneRef.current && rendererRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }

  return (
    <div className="relative w-full h-screen">
      <div ref={mountRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-4">Controles da Animação (FIXED)</h3>
        <div className="space-y-2">
          <button 
            onClick={startAnimation} 
            disabled={isPlaying}
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Iniciar Animação
          </button>
          <button 
            onClick={stopAnimation} 
            disabled={!isPlaying}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            Pausar
          </button>
          <button 
            onClick={resetAnimation}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Resetar
          </button>
        </div>
        
        <div className="mt-4 text-sm">
          <p><strong>Tempo:</strong> {(animationTime / 1000).toFixed(1)}s / 18.0s</p>
          <p><strong>Estado:</strong> {isPlaying ? 'Rodando' : 'Parado'}</p>
          <p><strong>Fase:</strong> {currentPhase}</p>
          <p><strong>Progresso:</strong> {((animationTime / 1000) / 18 * 100).toFixed(1)}%</p>          <p><strong>Fase atual:</strong> {
            (animationTime / 1000) < 8 ? '1-Corrida ida/volta' :
            (animationTime / 1000) < 11 ? '2-Preparação' :
            (animationTime / 1000) < 14 ? '3-Chute' : '4-Comemoração'
          }</p>
        </div>
        
        <div className="mt-4 text-xs text-gray-300">
          <h4 className="font-bold mb-2">Técnicas demonstradas:</h4>
          <p>• <strong>FK:</strong> Rotação direta dos ossos (corrida/chute)</p>
          <p>• <strong>IK:</strong> Posicionamento por alvo (preparação)</p>
          <p>• <strong>Timing:</strong> Performance.now() baseado</p>
          <p>• <strong>Bones:</strong> Sistema de esqueleto com 15 ossos</p>
        </div>
      </div>
    </div>
  )
}

export default FootballAnimationFixed
