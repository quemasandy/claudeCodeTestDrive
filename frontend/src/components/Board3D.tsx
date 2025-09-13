import { useRef } from 'react'
import { Group } from 'three'
import { BoardLevel } from './BoardLevel'
import { Pieces3D } from './Pieces3D'
import { ProjectedBoard } from './ProjectedBoard'
import { LevelGlassGrids } from './LevelGlassGrids'

export function Board3D() {
  const boardRef = useRef<Group>(null)

  // With 3 levels (z=0..2), center along Z is at z=2 local -> group z offset -2 to keep world center at 0
  return (
    <group ref={boardRef} position={[-7, -7, -2]}>
      {/* Render only 3 levels (0..2) with hitboxes */}
      {[0, 1, 2].map((level) => (
        <BoardLevel
          key={level}
          level={level}
          opacity={level === 0 ? 1 : Math.max(0.1, 0.8 - (level * 0.1))}
          showVisual={false}
        />
      ))}

      {/* Layered ethereal glass grids for each level */}
      <LevelGlassGrids />

      {/* Projected board overlays (shadows/lights) */}
      <ProjectedBoard />

      {/* Render all pieces */}
      <Pieces3D />

      {/* Hover en suelo gestionado por ProjectedBoard */}
    </group>
  )
}
