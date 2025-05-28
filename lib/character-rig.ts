import * as THREE from 'three'

export class CharacterRig {
  skeleton!: THREE.Skeleton
  bones: { [key: string]: THREE.Bone }
  mesh!: THREE.SkinnedMesh

  constructor() {
    this.bones = {}
    this.createSkeleton()
    this.createMesh()
  }

  private createSkeleton() {
    // Criar ossos do boneco
    const hip = new THREE.Bone() // 0 - quadril
    hip.name = 'hip'
    hip.position.set(0, 1, 0)

    const spine = new THREE.Bone() // 1 - coluna
    spine.name = 'spine'
    spine.position.set(0, 0.3, 0)
    hip.add(spine)

    const head = new THREE.Bone() // 2 - cabeça
    head.name = 'head'
    head.position.set(0, 0.4, 0)
    spine.add(head)

    // Pernas
    const leftThigh = new THREE.Bone() // 3 - coxa esquerda
    leftThigh.name = 'leftThigh'
    leftThigh.position.set(-0.15, -0.1, 0)
    hip.add(leftThigh)

    const leftShin = new THREE.Bone() // 4 - canela esquerda
    leftShin.name = 'leftShin'
    leftShin.position.set(0, -0.4, 0)
    leftThigh.add(leftShin)

    const leftFoot = new THREE.Bone() // 5 - pé esquerdo
    leftFoot.name = 'leftFoot'
    leftFoot.position.set(0, -0.3, 0.1)
    leftShin.add(leftFoot)

    const rightThigh = new THREE.Bone() // 6 - coxa direita
    rightThigh.name = 'rightThigh'
    rightThigh.position.set(0.15, -0.1, 0)
    hip.add(rightThigh)

    const rightShin = new THREE.Bone() // 7 - canela direita
    rightShin.name = 'rightShin'
    rightShin.position.set(0, -0.4, 0)
    rightThigh.add(rightShin)

    const rightFoot = new THREE.Bone() // 8 - pé direito
    rightFoot.name = 'rightFoot'
    rightFoot.position.set(0, -0.3, 0.1)
    rightShin.add(rightFoot)

    // Braços
    const leftShoulder = new THREE.Bone() // 9 - ombro esquerdo
    leftShoulder.name = 'leftShoulder'
    leftShoulder.position.set(-0.2, 0.2, 0)
    spine.add(leftShoulder)

    const leftArm = new THREE.Bone() // 10 - braço esquerdo
    leftArm.name = 'leftArm'
    leftArm.position.set(-0.3, 0, 0)
    leftShoulder.add(leftArm)

    const leftForearm = new THREE.Bone() // 11 - antebraço esquerdo
    leftForearm.name = 'leftForearm'
    leftForearm.position.set(-0.25, 0, 0)
    leftArm.add(leftForearm)

    const rightShoulder = new THREE.Bone() // 12 - ombro direito
    rightShoulder.name = 'rightShoulder'
    rightShoulder.position.set(0.2, 0.2, 0)
    spine.add(rightShoulder)

    const rightArm = new THREE.Bone() // 13 - braço direito
    rightArm.name = 'rightArm'
    rightArm.position.set(0.3, 0, 0)
    rightShoulder.add(rightArm)

    const rightForearm = new THREE.Bone() // 14 - antebraço direito
    rightForearm.name = 'rightForearm'
    rightForearm.position.set(0.25, 0, 0)
    rightArm.add(rightForearm)

    // Armazenar referências dos ossos
    this.bones = {
      hip,
      spine,
      head,
      leftThigh,
      leftShin,
      leftFoot,
      rightThigh,
      rightShin,
      rightFoot,
      leftShoulder,
      leftArm,
      leftForearm,
      rightShoulder,
      rightArm,
      rightForearm
    }

    const boneArray = Object.values(this.bones)
    this.skeleton = new THREE.Skeleton(boneArray)
  }
  private createMesh() {
    // Criar geometria mais elaborada para o boneco
    const bodyGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8)
    const headGeometry = new THREE.SphereGeometry(0.12, 8, 8)
    const limbGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.3, 6)
    
    // Combinar todas as geometrias
    const geometry = new THREE.BufferGeometry()
    
    // Corpo
    const bodyPositions = bodyGeometry.attributes.position.array
    const bodyIndices = bodyGeometry.index?.array || []
    
    // Cabeça (posição ajustada)
    headGeometry.translate(0, 0.6, 0)
    const headPositions = headGeometry.attributes.position.array
    const headIndices = headGeometry.index?.array || []
    
    // Combinar posições
    const positions = new Float32Array(bodyPositions.length + headPositions.length)
    positions.set(bodyPositions, 0)
    positions.set(headPositions, bodyPositions.length)
    
    // Combinar índices
    const indices = new Uint16Array(bodyIndices.length + headIndices.length)
    indices.set(bodyIndices, 0)
    // Ajustar índices da cabeça
    const headIndexOffset = bodyPositions.length / 3
    for (let i = 0; i < headIndices.length; i++) {
      indices[bodyIndices.length + i] = headIndices[i] + headIndexOffset
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setIndex(new THREE.BufferAttribute(indices, 1))
    
    // Calcular normais
    geometry.computeVertexNormals()
    
    // Criar array de vértices e weights para skinning
    const position = geometry.attributes.position
    const skinIndices = []
    const skinWeights = []

    for (let i = 0; i < position.count; i++) {
      const vertex = new THREE.Vector3()
      vertex.fromBufferAttribute(position, i)
      
      // Atribuir pesos baseado na altura do vértice
      const y = vertex.y
      
      if (y > 0.4) {
        // Cabeça/pescoço
        skinIndices.push(2, 1, 0, 0) // head, spine
        skinWeights.push(0.8, 0.2, 0, 0)
      } else if (y > 0) {
        // Torso
        skinIndices.push(1, 0, 0, 0) // spine, hip
        skinWeights.push(0.7, 0.3, 0, 0)
      } else if (y > -0.4) {
        // Coxa
        if (vertex.x < 0) {
          skinIndices.push(3, 0, 0, 0) // leftThigh, hip
          skinWeights.push(0.8, 0.2, 0, 0)
        } else {
          skinIndices.push(6, 0, 0, 0) // rightThigh, hip
          skinWeights.push(0.8, 0.2, 0, 0)
        }
      } else {
        // Canela/pé
        if (vertex.x < 0) {
          skinIndices.push(4, 3, 0, 0) // leftShin, leftThigh
          skinWeights.push(0.8, 0.2, 0, 0)
        } else {
          skinIndices.push(7, 6, 0, 0) // rightShin, rightThigh
          skinWeights.push(0.8, 0.2, 0, 0)
        }
      }
    }

    geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4))
    geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4))
    
    // Material mais visível
    const material = new THREE.MeshPhongMaterial({
      color: 0xff6b35,
      shininess: 30
    })    // Criar mesh skinned
    this.mesh = new THREE.SkinnedMesh(geometry, material)
    this.mesh.add(this.skeleton.bones[0]) // Adicionar root bone
    this.mesh.bind(this.skeleton)
    this.mesh.castShadow = true
    
    // Posicionar o mesh corretamente
    this.mesh.position.set(0, 0, 0)
    this.mesh.updateMatrixWorld(true)
  }

  getBone(name: string): THREE.Bone | undefined {
    return this.bones[name]
  }

  getMesh(): THREE.SkinnedMesh {
    return this.mesh
  }

  getSkeleton(): THREE.Skeleton {
    return this.skeleton
  }
}
