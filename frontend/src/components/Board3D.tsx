import { useRef } from 'react'
import { Group } from 'three'
import { BoardLevel } from './BoardLevel'
import { Pieces3D } from './Pieces3D'
import { ProjectedBoard } from './ProjectedBoard'
import { LevelGlassGrids } from './LevelGlassGrids'

export function Board3D() {
  const boardRef = useRef<Group>(null)

  return (
    <group ref={boardRef} position={[-7, -7, -7]}>
      {/* Render all 8 levels with transparency */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((level) => (
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
