import { DoubleSide } from 'three'

interface WhiteRoomProps {
  size?: number
  color?: string
  opacity?: number
}

// Sala blanca minimalista: paredes/techo/suelo translúcidos, estilo "Matrix"
export function WhiteRoom({ size = 60, color = '#ffffff', opacity = 0.12 }: WhiteRoomProps) {
  const half = size / 2

  return (
    <group name="white-room">
      {/* Suelo (XY) */}
      <mesh position={[0, 0, -half + 0.1]} raycast={() => null}>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.95}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>

      {/* Techo (XY) */}
      <mesh position={[0, 0, half]} raycast={() => null}>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity * 0.9}
          roughness={0.95}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>

      {/* Pared izquierda (YZ) */}
      <mesh position={[-half, 0, 0]} rotation={[0, Math.PI / 2, 0]} raycast={() => null}>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.95}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>

      {/* Pared derecha (YZ) */}
      <mesh position={[half, 0, 0]} rotation={[0, -Math.PI / 2, 0]} raycast={() => null}>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.95}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>

      {/* Pared fondo (XZ) */}
      <mesh position={[0, -half, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <planeGeometry args={[size, size]} />
        <meshPhysicalMaterial
          color={color}
          transparent
          opacity={opacity}
          roughness={0.95}
          metalness={0}
          side={DoubleSide}
        />
      </mesh>
    </group>
  )
}
