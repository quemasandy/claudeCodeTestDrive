import { Square3D } from './Square3D'
import { isValidSquare } from '../utils/gameLogic'

interface BoardLevelProps {
  level: number
  opacity: number
  showVisual?: boolean
}

export function BoardLevel({ level, opacity, showVisual = true }: BoardLevelProps) {
  const squares = []

  // Map visual opacity by level:
  // - Level 0 (base): solid look (handled in Square3D)
  // - Higher levels: progressively more opaque (glassier at the top)
  const visualOpacity = level === 0 ? 1 : Math.min(0.85, 0.2 + level * 0.09)

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (isValidSquare(x, y, level)) {
        squares.push(
          <Square3D
            key={`${x}-${y}-${level}`}
            position={[x, y, level]}
            opacity={visualOpacity}
            showVisual={showVisual}
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
