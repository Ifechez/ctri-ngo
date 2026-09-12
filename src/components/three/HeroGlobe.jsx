import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Signature visual for C.T.R.I: individual "person" nodes, scattered at
 * first, that continuously close ranks into a protective ring around a
 * globe — a literal read of the org's name and its hands-around-the-globe
 * mark. Built from instanced spheres + line arcs so it stays lightweight.
 */
function Nodes({ count = 64 }) {
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const nodeData = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2
      const ringRadius = 2.6 + Math.sin(i * 12.9898) * 0.15
      return {
        angle,
        ringRadius,
        scatterOffset: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
          z: (Math.random() - 0.5) * 6,
        },
        speed: 0.15 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
      }
    })
  }, [count])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const closeRanks = Math.min(1, t / 3.5) // settle into formation over ~3.5s

    nodeData.forEach((n, i) => {
      const wobble = Math.sin(t * n.speed + n.phase) * 0.12
      const ringX = Math.cos(n.angle + t * 0.06) * (n.ringRadius + wobble)
      const ringZ = Math.sin(n.angle + t * 0.06) * (n.ringRadius + wobble)
      const ringY = Math.sin(n.angle * 2 + t * 0.3) * 0.3

      const x = THREE.MathUtils.lerp(n.scatterOffset.x, ringX, closeRanks)
      const y = THREE.MathUtils.lerp(n.scatterOffset.y, ringY, closeRanks)
      const z = THREE.MathUtils.lerp(n.scatterOffset.z, ringZ, closeRanks)

      dummy.position.set(x, y, z)
      const s = 0.06 + 0.02 * Math.sin(t + i)
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 12, 12]} />
      <meshStandardMaterial color="#e4bc6b" emissive="#c9972f" emissiveIntensity={0.4} roughness={0.4} />
    </instancedMesh>
  )
}

function Globe() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.08
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.5, 48, 48]} />
      <meshStandardMaterial color="#2a6f8e" roughness={0.6} metalness={0.1} wireframe={false} />
    </mesh>
  )
}

function GlobeWire() {
  const ref = useRef()
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.05
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.56, 20, 20]} />
      <meshBasicMaterial color="#e4bc6b" wireframe transparent opacity={0.25} />
    </mesh>
  )
}

export default function HeroGlobe() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.6, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#e4bc6b" />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#b3122b" />
        <Globe />
        <GlobeWire />
        <Nodes />
      </Canvas>
    </div>
  )
}
