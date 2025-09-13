import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { Edges } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'
import { getCaptureMoves } from '../utils/gameLogic'

interface Square3DProps {
  position: [number, number, number]
  opacity: number
  showVisual?: boolean // Projection mode disables visual cube; keeps hitbox only
}

export function Square3D({ position, opacity, showVisual = true }: Square3DProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { selectSquare, selectedSquare, validMoves, selectedPiece, pieces } = useGameStore()

  const [x, y, z] = position
  const isSelected = selectedSquare?.x === x && selectedSquare?.y === y && selectedSquare?.z === z
  const isValidMove = validMoves.some(move => move.x === x && move.y === y && move.z === z)

  // Check if this is a capture move
  const isCapture = selectedPiece && isValidMove
    ? getCaptureMoves(selectedPiece, pieces).some(move => move.x === x && move.y === y && move.z === z)
    : false

  const handleClick = () => {
    selectSquare(x, y, z)
  }

  // Palette: base soft, glassy levels above with pastel highlights
  const getBaseColor = () => (z === 0 ? '#eef2f7' : '#e6f1fa')
  const getEdgeColor = () => {
    if (isCapture) return '#ef4444'
    if (isValidMove) return '#60a5fa'
    return '#93c5fd'
  }

  return (
    <group>
      {/* Hitbox invisible más grande para facilitar selección */}
      <mesh
        position={[x * 2, y * 2, z * 2 + 0.4]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={false}
      >
        <boxGeometry args={[2.2, 2.2, 1.0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {showVisual && (
        <mesh ref={meshRef} position={[x * 2, y * 2, z * 2]}>
          <boxGeometry args={[1.8, 1.8, 0.2]} />
          {/* Base satinada en nivel 0; niveles superiores semi‑translúcidos */}
          {z === 0 ? (
            <meshPhysicalMaterial
              color={getBaseColor()}
              transparent
              opacity={0.98}
              roughness={0.95}
              metalness={0.05}
              clearcoat={0.05}
            />
          ) : (
            <meshPhysicalMaterial
              color={getBaseColor()}
              transparent
              opacity={opacity}
              roughness={0.25}
              metalness={0.05}
              transmission={0.35}
              thickness={0.5}
              ior={1.12}
            />
          )}

          {/* Borde luminoso sutil */}
        <Edges scale={1.001} threshold={12}>
          <lineBasicMaterial
            color={getEdgeColor()}
            transparent
            opacity={isValidMove || isCapture || hovered ? 0.9 : 0.25}
          />
        </Edges>
      </mesh>
      )}

      {/* Borde brillante para casillas de movimiento válido */}
      {showVisual && isValidMove && (
        <mesh position={[x * 2, y * 2, z * 2 + 0.12]}>
          <torusGeometry args={[1.1, 0.04, 8, 16]} />
          <meshBasicMaterial
            color={isCapture ? '#dc2626' : '#3b82f6'}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Efecto adicional para casillas de captura */}
      {showVisual && isCapture && (
        <mesh position={[x * 2, y * 2, z * 2 + 0.15]} rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[0.8, 0.03, 6, 12]} />
          <meshBasicMaterial
            color='#ef4444'
            transparent={true}
            opacity={0.6}
          />
        </mesh>
      )}
    </group>
  )
}
