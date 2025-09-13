import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useGameStore } from '../store/gameStore'
import { getCaptureMoves } from '../utils/gameLogic'

interface Square3DProps {
  position: [number, number, number]
  opacity: number
}

export function Square3D({ position, opacity }: Square3DProps) {
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

  const getSquareColor = () => {
    if (isSelected) return '#4ade80' // green for selected square
    if (isCapture) return '#dc2626' // dark red for captures
    if (isValidMove) return '#3b82f6' // blue for regular moves
    if (hovered) return '#64748b' // gray for hover
    return '#1e293b' // dark for normal squares
  }

  return (
    <group>
      {/* Hitbox invisible más grande para facilitar selección */}
      <mesh
        position={[x * 2, y * 2, 0.4]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={false}
      >
        <boxGeometry args={[2.2, 2.2, 1.0]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Casilla visual */}
      <mesh
        ref={meshRef}
        position={[x * 2, y * 2, 0]}
      >
        <boxGeometry args={[1.8, 1.8, 0.2]} />
        <meshStandardMaterial
          color={getSquareColor()}
          transparent={true}
          opacity={opacity}
        />
      </mesh>

      {/* Borde brillante para casillas de movimiento válido */}
      {isValidMove && (
        <mesh position={[x * 2, y * 2, 0.12]}>
          <torusGeometry args={[1.1, 0.04, 8, 16]} />
          <meshBasicMaterial
            color={isCapture ? '#dc2626' : '#3b82f6'}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Efecto adicional para casillas de captura */}
      {isCapture && (
        <mesh position={[x * 2, y * 2, 0.15]} rotation={[0, 0, Math.PI / 4]}>
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