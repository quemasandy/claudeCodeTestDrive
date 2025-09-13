import * as THREE from 'three'
import { useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { isValidSquare } from '../utils/gameLogic'

// Ethereal frosted-glass grids for each of the 8 levels (XY planes at z = level*2)
// - Soft celeste tint
// - Semi-transparent
// - Slightly brighter outer border
// - Farther planes fade a bit with camera distance

function createGridGeometry(): THREE.BufferGeometry {
  const positions: number[] = []
  const max = 14
  const step = 2

  // vertical lines (x constant)
  for (let x = 0; x <= max; x += step) {
    positions.push(x, 0, 0, x, max, 0)
  }
  // horizontal lines (y constant)
  for (let y = 0; y <= max; y += step) {
    positions.push(0, y, 0, max, y, 0)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  return geo
}

const gridGeometry = createGridGeometry()
const borderPlane = new THREE.PlaneGeometry(14, 14)
const tilePlane = new THREE.PlaneGeometry(1.8, 1.8)

function opacityForDistance(dist: number, base: number) {
  // Map distance into [0.7..1.0] weight (closer -> 1, farther -> 0.7)
  const weight = THREE.MathUtils.clamp(1 - (dist - 15) / 60, 0.7, 1)
  return THREE.MathUtils.clamp(base * weight, 0.04, 0.28)
}

function LevelPlane({ level }: { level: number }) {
  const { camera } = useThree()
  const lineMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#8ecae6', transparent: true, opacity: 0.35 }), [])
  const borderMat = useMemo(() => new THREE.LineBasicMaterial({ color: '#bde0fe', transparent: true, opacity: 0.55 }), [])
  const tileMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: '#cfeffd', // azul hielo sutil
    transparent: true,
    opacity: 0.14
  }), [])
  const fillMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#dff3ff', // celeste pálido
    transparent: true,
    opacity: 0.12,
    roughness: 0.85,
    metalness: 0.0,
    transmission: 0.15,
    thickness: 0.2,
    ior: 1.1,
    side: THREE.DoubleSide
  }), [])

  useFrame(() => {
    // Board group z offset is -2 (for 3 levels). Plane world center ≈ level*2 - 2
    const center = new THREE.Vector3(0, 0, level * 2 - 2)
    const dist = camera.position.distanceTo(center)
    const base = 0.12 + level * 0.02
    const op = opacityForDistance(dist, base)
    fillMat.opacity = op
    lineMat.opacity = THREE.MathUtils.clamp(op * 1.8, 0.15, 0.5)
    borderMat.opacity = THREE.MathUtils.clamp(op * 2.2, 0.2, 0.7)
    tileMat.opacity = THREE.MathUtils.clamp(op * 4.4, 0.8, 1)
  })

  return (
    <group position={[0, 0, level * 2]}>
      {/* Frosted fill (centered at [7,7]) */}
      <mesh raycast={() => null} geometry={borderPlane} position={[7, 7, 0]}>
        <primitive object={fillMat} attach="material" />
      </mesh>

      {/* Grid lines */}
      <lineSegments raycast={() => null} geometry={gridGeometry}>
        <primitive object={lineMat} attach="material" />
      </lineSegments>

      {/* Checker tint on odd squares (ice-blue), ultra subtle */}
      {Array.from({ length: 8 }, (_, x) =>
        Array.from({ length: 8 }, (_, y) =>
          isValidSquare(x, y, level) ? (
            <mesh
              key={`odd-${x}-${y}-${level}`}
              raycast={() => null}
              geometry={tilePlane}
              position={[x * 2, y * 2, 0.001]}
            >
              <primitive object={tileMat} attach="material" />
            </mesh>
          ) : null
        )
      )}

      {/* Outer border slightly brighter */}
      <lineSegments raycast={() => null} position={[7, 7, 0]}>
        <edgesGeometry args={[borderPlane]} />
        <primitive object={borderMat} attach="material" />
      </lineSegments>
    </group>
  )
}

export function LevelGlassGrids() {
  return (
    <group name="level-glass-grids">
      {Array.from({ length: 3 }, (_, z) => (
        <LevelPlane key={z} level={z} />
      ))}
    </group>
  )
}
