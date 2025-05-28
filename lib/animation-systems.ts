import * as THREE from 'three'

export class IKSolver {
  chain: THREE.Bone[]
  target: THREE.Vector3
  iterations: number

  constructor(chain: THREE.Bone[], target: THREE.Vector3, iterations = 10) {
    this.chain = chain
    this.target = target
    this.iterations = iterations
  }

  solve() {
    for (let i = 0; i < this.iterations; i++) {
      this.solveForward()
      this.solveBackward()
    }
  }

  private solveForward() {
    // Forward reaching: start from end effector
    const endEffector = this.chain[this.chain.length - 1]
    const endPosition = new THREE.Vector3()
    endEffector.getWorldPosition(endPosition)

    // Move end effector to target
    const direction = new THREE.Vector3().subVectors(this.target, endPosition).normalize()
    
    for (let i = this.chain.length - 1; i >= 0; i--) {
      const bone = this.chain[i]
      const bonePosition = new THREE.Vector3()
      bone.getWorldPosition(bonePosition)
      
      if (i < this.chain.length - 1) {
        const nextBone = this.chain[i + 1]
        const nextPosition = new THREE.Vector3()
        nextBone.getWorldPosition(nextPosition)
        
        const distance = bonePosition.distanceTo(nextPosition)
        const newPosition = nextPosition.clone().sub(direction.clone().multiplyScalar(distance))
        
        bone.position.copy(bone.parent ? bone.parent.worldToLocal(newPosition) : newPosition)
      }
    }
  }

  private solveBackward() {
    // Backward reaching: start from root
    const root = this.chain[0]
    const rootPosition = new THREE.Vector3()
    root.getWorldPosition(rootPosition)

    for (let i = 0; i < this.chain.length - 1; i++) {
      const bone = this.chain[i]
      const nextBone = this.chain[i + 1]
      
      const bonePosition = new THREE.Vector3()
      bone.getWorldPosition(bonePosition)
      
      const nextPosition = new THREE.Vector3()
      nextBone.getWorldPosition(nextPosition)
      
      const direction = new THREE.Vector3().subVectors(nextPosition, bonePosition).normalize()
      const distance = bonePosition.distanceTo(nextPosition)
      
      const newNextPosition = bonePosition.clone().add(direction.multiplyScalar(distance))
      nextBone.position.copy(nextBone.parent ? nextBone.parent.worldToLocal(newNextPosition) : newNextPosition)
    }
  }
}

export class FKController {
  bones: THREE.Bone[]
  
  constructor(bones: THREE.Bone[]) {
    this.bones = bones
  }

  setRotation(boneIndex: number, rotation: THREE.Euler) {
    if (this.bones[boneIndex]) {
      this.bones[boneIndex].rotation.copy(rotation)
    }
  }

  animateWalk(time: number) {
    // Simular caminhada com FK
    const walkSpeed = 3
    const swing = Math.sin(time * walkSpeed)
    
    // Perna direita
    if (this.bones[0]) this.bones[0].rotation.x = swing * 0.5
    if (this.bones[1]) this.bones[1].rotation.x = Math.max(0, -swing * 0.8)
    
    // Perna esquerda
    if (this.bones[2]) this.bones[2].rotation.x = -swing * 0.5
    if (this.bones[3]) this.bones[3].rotation.x = Math.max(0, swing * 0.8)
    
    // Braços
    if (this.bones[4]) this.bones[4].rotation.x = -swing * 0.3
    if (this.bones[5]) this.bones[5].rotation.x = swing * 0.3
  }
}

export class HingeJoint {
  bone: THREE.Bone
  axis: THREE.Vector3
  minAngle: number
  maxAngle: number
  pivot: THREE.Vector3

  constructor(bone: THREE.Bone, axis: THREE.Vector3, minAngle: number, maxAngle: number, pivot?: THREE.Vector3) {
    this.bone = bone
    this.axis = axis.normalize()
    this.minAngle = minAngle
    this.maxAngle = maxAngle
    this.pivot = pivot || new THREE.Vector3()
  }

  setAngle(angle: number) {
    // Clamp angle within limits
    const clampedAngle = THREE.MathUtils.clamp(angle, this.minAngle, this.maxAngle)
    
    // Apply rotation around the pivot point
    const quaternion = new THREE.Quaternion().setFromAxisAngle(this.axis, clampedAngle)
    
    // Store original position relative to pivot
    const originalPosition = this.bone.position.clone().sub(this.pivot)
    
    // Apply rotation
    this.bone.quaternion.copy(quaternion)
    
    // Restore position relative to pivot
    this.bone.position.copy(originalPosition.applyQuaternion(quaternion).add(this.pivot))
  }

  animateKick(time: number, phase: number) {
    const kickIntensity = Math.sin(time * 8) * Math.max(0, Math.sin(phase))
    this.setAngle(kickIntensity * (this.maxAngle - this.minAngle) / 2)
  }
}
