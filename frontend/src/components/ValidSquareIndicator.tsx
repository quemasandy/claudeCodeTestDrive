import { useRef } from 'react'
import { Mesh } from 'three'

interface ValidSquareIndicatorProps {
  position: [number, number, number]
  opacity: number
}

export function ValidSquareIndicator({ position, opacity }: ValidSquareIndicatorProps) {
  const meshRef = useRef<Mesh>(null)
  const [x, y, z] = position

  return (
    <mesh ref={meshRef} position={[x * 2, y * 2, 0]}>
      <ringGeometry args={[0.8, 1.0, 8]} />
      <meshStandardMaterial
        color="#10b981"
        transparent={true}
        opacity={opacity * 0.6}
      />
    </mesh>
  )
}