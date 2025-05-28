'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { CharacterRig } from '@/lib/character-rig'
import { IKSolver, FKController, HingeJoint } from '@/lib/animation-systems'
import { CinematicCamera } from '@/lib/cinematic-camera'
import { VisualEffects } from '@/lib/visual-effects'

interface FootballAnimationProps {
  onAnimationComplete?: () => void
}

const FootballAnimation: React.FC<FootballAnimationProps> = ({ onAnimationComplete }) => {  const mountRef = useRef<HTMLDivElement>(null)
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
  
  // Controllers
  const fkControllerRef = useRef<FKController>()
  const ikSolverRef = useRef<IKSolver>()
  const hingeJointsRef = useRef<HingeJoint[]>()
  const cinematicCameraRef = useRef<CinematicCamera>()
  const visualEffectsRef = useRef<VisualEffects>()
  
  // Effect triggers
  const lastDustTime = useRef(0)
  const kickEffectTriggered = useRef(false)
  const celebrationEffectTriggered = useRef(false)  // Animation function with proper timing
  const animate = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !characterRef.current) {
      console.log('Missing refs, skipping frame')
      return
    }

    if (!isPlaying) {
      console.log('Animation not playing, stopping')
      return
    }    // Calculate elapsed time since animation started
    const currentTime = performance.now()
    const elapsedTime = (currentTime - startTimeRef.current) / 1000 // Convert to seconds
    
    // Update animation time state (for UI display)
    setAnimationTime(elapsedTime * 1000) // Convert back to ms for display
    
    const character = characterRef.current
    const ball = ballRef.current!
    
    // Debug logging every second
    if (Math.floor(elapsedTime) !== Math.floor((elapsedTime - 0.016))) {
      console.log('Animation frame:', { 
        time: elapsedTime.toFixed(2),
        phase: (elapsedTime / 18).toFixed(3)
      })
    }
      console.log('Animating frame:', { elapsedTime: elapsedTime.toFixed(2) })
    
    // Simple 4-phase animation (18 seconds total)
    const totalDuration = 18
    const phase = elapsedTime / totalDuration
    
    let currentPhaseText = 'Preparando...'
    
    // Debug phase transitions
    if (Math.floor(elapsedTime * 2) !== Math.floor((elapsedTime - 0.016) * 2)) {
      console.log(`Phase check: time=${elapsedTime.toFixed(1)}s, phase=${phase.toFixed(3)}`)
    }
    
    if (phase < 0.3) {
      // Phase 1: Running (0-5.4s) - Forward Kinematics
      currentPhaseText = 'Correndo (FK)'
      
      const runTime = elapsedTime * 3
      
      // Simple leg animation
      const rightThigh = character.getBone('rightThigh')
      const leftThigh = character.getBone('leftThigh')
      const rightShin = character.getBone('rightShin')
      const leftShin = character.getBone('leftShin')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      
      if (rightThigh) {
        rightThigh.rotation.x = Math.sin(runTime) * 0.5
      }
      if (leftThigh) {
        leftThigh.rotation.x = -Math.sin(runTime) * 0.5
      }
      if (rightShin) {
        rightShin.rotation.x = Math.max(0, Math.sin(runTime + 0.5)) * 0.3
      }
      if (leftShin) {
        leftShin.rotation.x = Math.max(0, -Math.sin(runTime + 0.5)) * 0.3
      }
      
      // Arm animation
      if (rightArm) {
        rightArm.rotation.x = -Math.sin(runTime) * 0.3
      }
      if (leftArm) {
        leftArm.rotation.x = Math.sin(runTime) * 0.3      }
      
      // Move character forward
      character.getMesh().position.z = -elapsedTime * 1.5
      
    } else if (phase < 0.5) {
      // Phase 2: Kick preparation (5.4-9s) - Inverse Kinematics
      currentPhaseText = 'Preparando chute (IK)'
      
      const prepTime = (phase - 0.3) / 0.2 // 0 to 1 over preparation duration
      
      // Gradual preparation stance with animation
      const leftThigh = character.getBone('leftThigh')
      const leftShin = character.getBone('leftShin')
      const rightThigh = character.getBone('rightThigh')
      const rightShin = character.getBone('rightShin')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      
      // Support leg (left) positioning
      if (leftThigh) {
        leftThigh.rotation.x = -0.2 * prepTime
      }
      if (leftShin) {
        leftShin.rotation.x = 0.1 * prepTime
      }
      
      // Kicking leg (right) preparation
      if (rightThigh) {
        rightThigh.rotation.x = -0.3 * prepTime // Pull back for kick
      }
      if (rightShin) {
        rightShin.rotation.x = 0.2 * prepTime
      }
      
      // Arms for balance
      if (rightArm) {
        rightArm.rotation.x = -0.5 * prepTime
      }
      if (leftArm) {
        leftArm.rotation.x = 0.5 * prepTime
      }
      
      // Small movement animation during preparation
      const bobbing = Math.sin(elapsedTime * 4) * 0.02
      character.getMesh().position.y = bobbing
      
      // Use IK to position leg for kicking (optional, can disable if causing issues)
      // if (ikSolverRef.current && prepTime > 0.5) {
      //   const kickTarget = new THREE.Vector3(0.3, 0.2, character.getMesh().position.z + 1.5)
      //   ikSolverRef.current.target.copy(kickTarget)
      //   ikSolverRef.current.solve()
      // }
    } else if (phase < 0.7) {
      // Phase 3: Kicking (9-12.6s) - Direct FK Animation
      currentPhaseText = 'Chutando (FK Direto)'
      
      const kickPhase = (phase - 0.5) / 0.2 // 0 to 1 over kick duration
      const kickAngle = Math.sin(kickPhase * Math.PI) * 1.5
      
      // Debug logging
      console.log(`Kick animation: phase=${kickPhase.toFixed(3)}, angle=${kickAngle.toFixed(3)}`)
      
      // Simplified direct kick motion - no hinge joints
      const rightThigh = character.getBone('rightThigh')
      const rightShin = character.getBone('rightShin')
      const leftThigh = character.getBone('leftThigh')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      const spine = character.getBone('spine')
      
      // Main kicking leg motion - strong forward kick
      if (rightThigh) {
        rightThigh.rotation.x = kickAngle
        rightThigh.rotation.z = kickPhase * 0.2 // Slight outward rotation
      }
      if (rightShin) {
        rightShin.rotation.x = Math.max(0, kickAngle * 0.9)
      }
      
      // Support leg stability
      if (leftThigh) {
        leftThigh.rotation.x = -0.2 - kickPhase * 0.3
      }
      
      // Body lean into kick
      if (spine) {
        spine.rotation.x = kickPhase * 0.3
        spine.rotation.z = kickPhase * 0.1
      }
      
      // Arms for balance during kick
      if (rightArm) {
        rightArm.rotation.x = -0.7 - kickAngle * 0.4
        rightArm.rotation.z = kickPhase * 0.3
      }
      if (leftArm) {
        leftArm.rotation.x = 0.7 + kickAngle * 0.3
        leftArm.rotation.z = -kickPhase * 0.2
      }// Ball movement during kick - only move ball when actually kicked
      if (kickPhase > 0.5 && !kickEffectTriggered.current) {
        console.log('Triggering ball kick effect!')
        const kickTime = 9 + (0.2 * 0.5) // 9s + 50% of kick phase duration
        const ballFlightTime = Math.max(0, elapsedTime - kickTime) // Time since ball was kicked
        const initialVelocityX = 2
        const initialVelocityY = 8
        const initialVelocityZ = 15
        const gravity = -9.8
        
        // Only move ball if kick has actually happened
        if (ballFlightTime >= 0) {
          const newX = character.getMesh().position.x + initialVelocityX * ballFlightTime
          const newY = Math.max(0.15, 0.15 + initialVelocityY * ballFlightTime + 0.5 * gravity * ballFlightTime * ballFlightTime)
          const newZ = character.getMesh().position.z + initialVelocityZ * ballFlightTime
          
          ball.position.set(newX, newY, newZ)
          console.log(`Ball flying: x=${newX.toFixed(2)}, y=${newY.toFixed(2)}, z=${newZ.toFixed(2)}`)
          
          kickEffectTriggered.current = true
        }
      }
      
    } else {
      // Phase 4: Celebration (12.6-18s) - Combined FK + IK
      currentPhaseText = 'Comemorando (FK + IK)'
      
      const celebTime = elapsedTime * 2
      
      // FK for body movement
      const spine = character.getBone('spine')
      const head = character.getBone('head')
      const rightArm = character.getBone('rightArm')
      const leftArm = character.getBone('leftArm')
      
      if (spine) {
        spine.rotation.z = Math.sin(celebTime) * 0.2
      }
      if (head) {
        head.rotation.y = Math.sin(celebTime * 1.5) * 0.3
      }
      
      // IK for arm positioning
      if (rightArm) {
        rightArm.rotation.z = Math.PI * 0.3 + Math.sin(celebTime) * 0.2
        rightArm.rotation.x = Math.sin(celebTime * 0.5) * 0.1
      }
      if (leftArm) {
        leftArm.rotation.z = -Math.PI * 0.3 - Math.sin(celebTime) * 0.2
        leftArm.rotation.x = Math.sin(celebTime * 0.5) * 0.1
      }
    }
    
    // Update current phase display
    setCurrentPhase(currentPhaseText)

    // Render
    rendererRef.current.render(sceneRef.current, cameraRef.current)

    // Continue animation
    if (elapsedTime >= totalDuration) {
      setIsPlaying(false)
      if (onAnimationComplete) {
        onAnimationComplete()
      }
    } else {
      // Schedule next frame
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
    scene.add(field)    // Create character
    const character = new CharacterRig()
    scene.add(character.getMesh())
    characterRef.current = character
    
    console.log('Character created with bones:', Object.keys(character.bones))
    console.log('Character mesh position:', character.getMesh().position)
    console.log('Character skeleton:', character.getSkeleton())

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

    // Initialize controllers
    const bones = [
      character.getBone('rightThigh'),
      character.getBone('rightShin'),
      character.getBone('leftThigh'),
      character.getBone('leftShin'),
      character.getBone('rightArm'),
      character.getBone('leftArm')
    ].filter(bone => bone !== null) as THREE.Bone[]
    
    if (bones.length > 0) {
      fkControllerRef.current = new FKController(bones)
    }

    // Setup IK for leg
    const legBones = [
      character.getBone('rightThigh'),
      character.getBone('rightShin'),
      character.getBone('rightFoot')
    ].filter(bone => bone !== null) as THREE.Bone[]
    
    if (legBones.length >= 2) {
      const ikTarget = new THREE.Vector3(0.5, 0, 1.5)
      ikSolverRef.current = new IKSolver(legBones, ikTarget)
    }
      // Initialize other systems if available
    try {
      cinematicCameraRef.current = new CinematicCamera(camera)
      visualEffectsRef.current = new VisualEffects(scene)
      
      // Initialize hinge joints for knees - simplified
      hingeJointsRef.current = []
      const rightShin = character.getBone('rightShin')
      const leftShin = character.getBone('leftShin')
      
      console.log('Initializing hinge joints...', { rightShin: !!rightShin, leftShin: !!leftShin })
      
      if (rightShin) {
        try {
          const rightHinge = new HingeJoint(rightShin, new THREE.Vector3(1, 0, 0), -0.1, Math.PI * 0.7)
          hingeJointsRef.current.push(rightHinge)
          console.log('Right hinge joint created successfully')
        } catch (error) {
          console.warn('Failed to create right hinge joint:', error)
        }
      }
      if (leftShin) {
        try {
          const leftHinge = new HingeJoint(leftShin, new THREE.Vector3(1, 0, 0), -0.1, Math.PI * 0.7)
          hingeJointsRef.current.push(leftHinge)
          console.log('Left hinge joint created successfully')
        } catch (error) {
          console.warn('Failed to create left hinge joint:', error)
        }
      }
      
      console.log('Total hinge joints created:', hingeJointsRef.current.length)
    } catch (error) {
      console.warn('Some animation systems not available:', error)
    }

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
  // Effect to handle animation start/stop
  useEffect(() => {
    if (isPlaying && !animationIdRef.current) {
      console.log('Starting animation loop...')
      animate()
    } else if (!isPlaying && animationIdRef.current) {
      console.log('Stopping animation loop...')
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }
  }, [isPlaying])
  const startAnimation = () => {
    console.log('Start button clicked')
    setIsPlaying(true)
    setAnimationTime(0)
    startTimeRef.current = performance.now() // Set animation start time
    
    // Reset effect triggers
    kickEffectTriggered.current = false
    celebrationEffectTriggered.current = false
    lastDustTime.current = 0
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
    
    // Reset effect triggers
    kickEffectTriggered.current = false
    celebrationEffectTriggered.current = false
    lastDustTime.current = 0
    
    if (characterRef.current) {
      // Reset character position
      characterRef.current.getMesh().position.set(0, 0, 0)
      
      // Reset all bone rotations
      try {
        Object.values(characterRef.current.bones).forEach(bone => {
          bone.rotation.set(0, 0, 0)
        })
      } catch (error) {
        console.warn('Could not reset bone rotations:', error)
      }
    }
    
    if (ballRef.current) {
      // Reset ball position
      ballRef.current.position.set(0, 0.15, 2)
    }
    
    // Reset camera
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
        <h3 className="text-lg font-bold mb-4">Controles da Animação</h3>
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
        </div>        <div className="mt-4 text-sm">
          <p><strong>Tempo:</strong> {(animationTime / 1000).toFixed(1)}s / 18.0s</p>
          <p><strong>Estado:</strong> {isPlaying ? 'Rodando' : 'Parado'}</p>
          <p><strong>Fase:</strong> {currentPhase}</p>
          <p><strong>Progresso:</strong> {((animationTime / 1000) / 18 * 100).toFixed(1)}%</p>
          <p><strong>Fase atual:</strong> {
            (animationTime / 1000) < 5.4 ? '1-Corrida' :
            (animationTime / 1000) < 9 ? '2-Preparação' :
            (animationTime / 1000) < 12.6 ? '3-Chute' : '4-Comemoração'
          }</p>
        </div>
        
        <div className="mt-4 text-xs text-gray-300">
          <h4 className="font-bold mb-2">Técnicas demonstradas:</h4>
          <p>• <strong>FK:</strong> Rotação direta dos ossos (corrida)</p>
          <p>• <strong>IK:</strong> Posicionamento por alvo (preparação)</p>
          <p>• <strong>Hinge Joints:</strong> Limitação de ângulos (chute)</p>
          <p>• <strong>Bones:</strong> Sistema de esqueleto com 15 ossos</p>
        </div>
      </div>
    </div>
  )
}

export default FootballAnimation
