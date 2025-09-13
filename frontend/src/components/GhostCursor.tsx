import { useRef, useState } from 'react'
import { Mesh, Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import { isValidSquare } from '../utils/gameLogic'

export function GhostCursor() {
  const meshRef = useRef<Mesh>(null)
  const [hoveredSquare, setHoveredSquare] = useState<{ x: number, y: number, z: number } | null>(null)
  const { camera, raycaster, mouse, scene } = useThree()
  const { selectedPiece, validMoves, currentPlayer } = useGameStore()

  useFrame(() => {
    if (!meshRef.current) return

    // Configurar el raycaster desde la cámara
    raycaster.setFromCamera(mouse, camera)

    // Encontrar intersecciones con el plano del tablero
    const intersects = raycaster.intersectObjects(scene.children, true)

    if (intersects.length > 0) {
      const intersect = intersects[0]
      const point = intersect.point

      // Convertir punto 3D a coordenadas del tablero
      const x = Math.round(point.x / 2)
      const y = Math.round(point.y / 2)
      const z = Math.max(0, Math.min(7, Math.round(point.z / 2)))

      // Verificar si es una casilla válida del tablero
      if (x >= 0 && x < 8 && y >= 0 && y < 8 && z >= 0 && z < 8 && isValidSquare(x, y, z)) {
        setHoveredSquare({ x, y, z })

        // Posicionar el cursor fantasma
        meshRef.current.position.set(x * 2, y * 2, z * 2 + 0.15)
        meshRef.current.visible = true
      } else {
        meshRef.current.visible = false
        setHoveredSquare(null)
      }
    } else {
      meshRef.current.visible = false
      setHoveredSquare(null)
    }
  })

  const getCursorColor = () => {
    if (!hoveredSquare) return '#666666'

    // Si hay una ficha seleccionada, mostrar si es movimiento válido
    if (selectedPiece) {
      const isValidMove = validMoves.some(move =>
        move.x === hoveredSquare.x && move.y === hoveredSquare.y && move.z === hoveredSquare.z
      )
      return isValidMove ? '#10b981' : '#ef4444' // Verde para válido, rojo para inválido
    }

    // Si no hay ficha seleccionada, mostrar si hay una ficha del jugador actual en esta casilla
    return '#3b82f6' // Azul para selección
  }

  const getCursorOpacity = () => {
    if (!hoveredSquare) return 0.3

    if (selectedPiece) {
      const isValidMove = validMoves.some(move =>
        move.x === hoveredSquare.x && move.y === hoveredSquare.y && move.z === hoveredSquare.z
      )
      return isValidMove ? 0.7 : 0.4
    }

    return 0.5
  }

  return (
    <mesh ref={meshRef} visible={false}>
      <cylinderGeometry args={[0.8, 0.8, 0.05, 16]} />
      <meshBasicMaterial
        color={getCursorColor()}
        transparent
        opacity={getCursorOpacity()}
      />
    </mesh>
  )
}