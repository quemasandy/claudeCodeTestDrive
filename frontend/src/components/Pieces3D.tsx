import { useGameStore } from '../store/gameStore'
import { Piece3D } from './Piece3D'

export function Pieces3D() {
  const { pieces } = useGameStore()

  return (
    <group>
      {pieces.map((piece) => (
        <Piece3D
          key={piece.id}
          piece={piece}
        />
      ))}
    </group>
  )
}