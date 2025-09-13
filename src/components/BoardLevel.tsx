import { Square3D } from './Square3D'
import { isValidSquare } from '../utils/gameLogic'

interface BoardLevelProps {
  level: number
  opacity: number
}

export function BoardLevel({ level, opacity }: BoardLevelProps) {
  const squares = []

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (isValidSquare(x, y, level)) {
        squares.push(
          <Square3D
            key={`${x}-${y}-${level}`}
            position={[x, y, level]}
            opacity={opacity}
          />
        )
      }
    }
  }

  return (
    <group position={[0, 0, level * 2]}>
      {squares}
    </group>
  )
}