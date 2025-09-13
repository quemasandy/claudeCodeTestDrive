import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useGameStore } from '../store/gameStore'
import type { Piece } from '../types/game'

interface Piece3DProps {
  piece: Piece
}

export function Piece3D({ piece }: Piece3DProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { selectPiece, selectedPiece } = useGameStore()

  const isSelected = selectedPiece?.id === piece.id
  const pieceColor = piece.player === 1 ? '#ef4444' : '#1f2937' // red or dark
  const emissionColor = isSelected ? '#ffffff' : hovered ? '#64748b' : '#000000'

  const handleClick = (e: any) => {
    e.stopPropagation()
    selectPiece(piece.id)
  }

  return (
    <mesh
      ref={meshRef}
      position={[piece.x * 2, piece.y * 2, piece.z * 2 + 0.5]}
      onClick={handleClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {piece.isKing ? (
        <coneGeometry args={[0.7, 1.2, 8]} />
      ) : (
        <cylinderGeometry args={[0.7, 0.7, 0.4, 16]} />
      )}
      <meshStandardMaterial
        color={pieceColor}
        emissive={emissionColor}
        emissiveIntensity={isSelected ? 0.3 : hovered ? 0.1 : 0}
      />
    </mesh>
  )
}