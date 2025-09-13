import { useRef, useState } from 'react'
import { Mesh } from 'three'
import { useFrame } from '@react-three/fiber'
import { useGameStore } from '../store/gameStore'
import type { Piece } from '../types/game'

interface Piece3DProps {
  piece: Piece
}

export function Piece3D({ piece }: Piece3DProps) {
  const meshRef = useRef<Mesh>(null)
  const crownRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { selectPiece, selectedPiece } = useGameStore()

  const isSelected = selectedPiece?.id === piece.id

  // Animación de flotación sutil + efectos dinámicos
  useFrame((state) => {
    if (meshRef.current) {
      const baseY = piece.y * 2 + 0.8
      const floatOffset = Math.sin(state.clock.getElapsedTime() + piece.x + piece.z) * 0.05

      // Elevar más cuando está en hover o seleccionado
      const hoverOffset = hovered ? 0.2 : 0
      const selectedOffset = isSelected ? 0.3 : 0

      meshRef.current.position.y = baseY + floatOffset + hoverOffset + selectedOffset
    }

    // Rotación del aura de corona (más rápida cuando seleccionada)
    if (crownRef.current && piece.isKing) {
      const rotationSpeed = isSelected ? 0.03 : 0.01
      crownRef.current.rotation.z += rotationSpeed
    }
  })

  const handleClick = (e: any) => {
    e.stopPropagation()
    selectPiece(piece.id)
  }

  // Configuración de materiales por jugador
  const getMaterial = () => {
    if (piece.player === 1) {
      // Jugador 1: Vidrio rojo translúcido
      return (
        <meshPhysicalMaterial
          color="#dc2626"
          transparent={true}
          opacity={0.85}
          transmission={0.3}
          roughness={0.1}
          metalness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={isSelected ? "#ff6b6b" : hovered ? "#ef4444" : "#000000"}
          emissiveIntensity={isSelected ? 0.6 : hovered ? 0.3 : 0}
        />
      )
    } else {
      // Jugador 2: Metal negro mate con reflejos
      return (
        <meshPhysicalMaterial
          color="#1f2937"
          roughness={0.3}
          metalness={0.8}
          reflectivity={0.5}
          emissive={isSelected ? "#64748b" : hovered ? "#374151" : "#000000"}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.25 : 0}
        />
      )
    }
  }

  return (
    <group>
      {/* Sombra sutil en la casilla */}
      <mesh position={[piece.x * 2, piece.y * 2, 0.11]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.6, 16]} />
        <meshBasicMaterial
          color="#000000"
          transparent={true}
          opacity={0.2}
        />
      </mesh>

      {/* Hitbox invisible más grande para facilitar selección */}
      <mesh
        position={[piece.x * 2, piece.y * 2, 0.8]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        visible={false}
      >
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Esfera principal flotante (solo visual) */}
      <mesh
        ref={meshRef}
        position={[piece.x * 2, piece.y * 2, 0.8]}
        scale={isSelected ? 1.2 : hovered ? 1.15 : 1}
        userData={{ transition: true }}
      >
        <sphereGeometry args={[0.6, 32, 32]} />
        {getMaterial()}
      </mesh>

      {/* Efecto de selección - anillo pulsante */}
      {isSelected && (
        <mesh position={[piece.x * 2, piece.y * 2, 0.05]}>
          <torusGeometry args={[1.0, 0.05, 8, 16]} />
          <meshBasicMaterial
            color={piece.player === 1 ? "#ef4444" : "#64748b"}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      )}

      {/* Efecto de corona para damas */}
      {piece.isKing && (
        <group position={[piece.x * 2, piece.y * 2, 0.8]}>
          {/* Aura exterior */}
          <mesh ref={crownRef}>
            <torusGeometry args={[1.2, 0.08, 8, 16]} />
            <meshBasicMaterial
              color={piece.player === 1 ? "#fbbf24" : "#60a5fa"}
              transparent={true}
              opacity={isSelected ? 0.8 : 0.6}
            />
          </mesh>

          {/* Aura interior */}
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <torusGeometry args={[0.9, 0.05, 6, 12]} />
            <meshBasicMaterial
              color={piece.player === 1 ? "#f59e0b" : "#3b82f6"}
              transparent={true}
              opacity={0.8}
            />
          </mesh>

          {/* Partículas de luz */}
          {[...Array(6)].map((_, i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i * Math.PI * 2) / 6) * 1.4,
                Math.sin((i * Math.PI * 2) / 6) * 1.4,
                0
              ]}
            >
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial
                color={piece.player === 1 ? "#fbbf24" : "#60a5fa"}
                transparent={true}
                opacity={0.7}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}