import { useMemo, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Edges } from '@react-three/drei'
import { useGameStore } from '../store/gameStore'
import { getCaptureMoves } from '../utils/gameLogic'

// Mapeo de colores pastel/azules por nivel (más neón al subir)
const levelColors = ['#cbd5e1', '#7dd3fc', '#38bdf8']
const levelOpacity = [0.28, 0.38, 0.48]

// Altura base sobre cada plano para evitar z-fighting con LevelGlassGrids
const LAYER_OFFSET = 0.02
const SIZE = 1.8

export function ProjectedBoard() {
  const { pieces, selectedPiece, validMoves } = useGameStore()

  // Capturas disponibles desde la pieza seleccionada
  const captureSet = useMemo(() => {
    if (!selectedPiece) return new Set<string>()
    const caps = getCaptureMoves(selectedPiece, pieces)
    return new Set(caps.map(c => `${c.x}-${c.y}-${c.z}`))
  }, [selectedPiece, pieces])

  return (
    <group name="projected-board">
      {/* Proyección inferior por ficha */}
      {pieces.map((p) => (
        <ProjectedSquare
          key={`proj-${p.id}`}
          x={p.x}
          y={p.y}
          z={p.z}
          color={levelColors[p.z] || levelColors[levelColors.length - 1]}
          opacity={levelOpacity[p.z] || 0.64}
        />
      ))}

      {/* Movimientos válidos del seleccionado (luz) en sus niveles reales */}
      {selectedPiece && validMoves.map((m, idx) => {
        const isCap = captureSet.has(`${m.x}-${m.y}-${m.z}`)
        return (
          <ProjectedSquare
            key={`vm-${idx}`}
            x={m.x}
            y={m.y}
            z={m.z}
            color={isCap ? '#ef4444' : '#60a5fa'}
            opacity={isCap ? 0.6 : 0.45}
            glow
          />
        )
      })}

      {/* Hover en suelo: borde blanco tenue */}
      <ProjectedHover />
    </group>
  )
}

function ProjectedSquare({ x, y, z, color, opacity, glow = false }: { x: number, y: number, z: number, color: string, opacity: number, glow?: boolean }) {
  return (
    <group position={[x * 2, y * 2, z * 2 + LAYER_OFFSET]}>
      <mesh raycast={() => null}>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Borde: más visible si es glow (movimiento/captura) */}
      <mesh raycast={() => null}>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges>
          <lineBasicMaterial color={glow ? '#ffffff' : '#e5e7eb'} transparent opacity={glow ? 0.9 : 0.25} />
        </Edges>
      </mesh>
    </group>
  )
}

function ProjectedHover() {
  const outlineRef = useRef<any>(null)
  const { camera, raycaster, mouse, scene } = useThree()

  useFrame(() => {
    const outline = outlineRef.current
    if (!outline) return
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length) {
      const p = intersects[0].point
      const x = Math.round(p.x / 2)
      const y = Math.round(p.y / 2)
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        outline.visible = true
        outline.position.set(x * 2, y * 2, LAYER_OFFSET + 0.005)
        return
      }
    }
    outline.visible = false
  })

  return (
    <group ref={outlineRef} visible={false}>
      <mesh raycast={() => null}>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshBasicMaterial transparent opacity={0} />
        <Edges>
          <lineBasicMaterial color={'#ffffff'} transparent opacity={0.9} />
        </Edges>
      </mesh>
    </group>
  )
}
