import { useRef } from 'react'
import { Group } from 'three'
import { BoardLevel } from './BoardLevel'
import { Pieces3D } from './Pieces3D'

export function Board3D() {
  const boardRef = useRef<Group>(null)

  return (
    <group ref={boardRef} position={[0, 0, 0]}>
      {/* Render all 4 levels with transparency */}
      {[0, 1, 2, 3].map((level) => (
        <BoardLevel
          key={level}
          level={level}
          opacity={level === 0 ? 1 : 0.3 + (level * 0.2)}
        />
      ))}

      {/* Render all pieces */}
      <Pieces3D />
    </group>
  )
}