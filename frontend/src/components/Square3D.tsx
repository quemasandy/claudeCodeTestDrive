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
    <mesh
      ref={meshRef}
      position={[x * 2, y * 2, 0]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1.8, 1.8, 0.2]} />
      <meshStandardMaterial
        color={getSquareColor()}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  )
}