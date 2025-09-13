import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Board3D } from './Board3D'
import { GameUI } from './GameUI'
import { RotationControls } from './RotationControls'
import { DynamicPieceSelector } from './DynamicPieceSelector'
import { WhiteRoom } from './WhiteRoom'
import { useGameStore } from '../store/gameStore'
import { useRef, useCallback, useEffect } from 'react'
// Controlaremos la cámara usando OrbitControls de forma imperativa para permitir vueltas completas

// Posición inicial de la cámara compartida entre Canvas y reset de vista
const INITIAL_CAMERA_POSITION: [number, number, number] = [25, 0, -4]

export function Checkers3D() {
  const controlsRef = useRef<any>(null)

  const handleRotation = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    const step = Math.PI / 8
    const controls = controlsRef.current
    if (!controls) return
    if (direction === 'left') controls.rotateLeft(step)
    if (direction === 'right') controls.rotateLeft(-step)
    if (direction === 'up') controls.rotateUp(step)
    if (direction === 'down') controls.rotateUp(-step)
    controls.update()
  }, [])

  const handleHorizontalRotation = useCallback((direction: 'clockwise' | 'counterclockwise') => {
    const step = Math.PI / 8
    const controls = controlsRef.current
    if (!controls) return
    if (direction === 'clockwise') controls.rotateLeft(-step)
    else controls.rotateLeft(step)
    controls.update()
  }, [])

  // Roll (rotar alrededor del eje de visión) para control en 3D completo
  const handleRoll = useCallback((direction: 'left' | 'right') => {
    const angle = Math.PI / 18 // 10° por clic
    const controls = controlsRef.current
    if (!controls) return
    const cam = controls.object as THREE.PerspectiveCamera
    const dir = new THREE.Vector3()
    cam.getWorldDirection(dir)
    cam.up.applyAxisAngle(dir, direction === 'left' ? angle : -angle).normalize()
    controls.update()
  }, [])

  // Reset a vista de espectador con rojas a la izquierda (según orientación inicial)
  const handleResetView = useCallback(() => {
    const controls = controlsRef.current
    if (!controls) return
    // Cámara mirando desde +X hacia el centro, con Z como "arriba"
    controls.object.position.set(...INITIAL_CAMERA_POSITION)
    controls.target.set(0, 0, 0)
    controls.object.up.set(0, 0, 1)
    controls.update()
  }, [])

  // Inicializar cámara como espectador al montar
  useEffect(() => {
    handleResetView()
  }, [handleResetView])

  return (
    <div className="checkers-3d">
      <div className="game-canvas">
        <div className="canvas-container">
          <Canvas
            camera={{ position: INITIAL_CAMERA_POSITION, fov: 70 }}
            onCreated={({ camera }) => {
              // Usar Z como eje "arriba" para que el tablero se perciba con el suelo en Z=0
              camera.up.set(0, 0, 1)
            }}
          >
            {/* Fondo blanco muy suave + sala minimalista */}
            <color attach="background" args={["#f7fafc"]} />
            {/* Fog sutil para mejorar percepción de profundidad sin saturar */}
            <fog attach="fog" args={["#f7fafc", 50, 120]} />

            <WhiteRoom size={70} color="#ffffff" opacity={0.12} />
            {/* Iluminación mejorada para materiales realistas */}
            <ambientLight intensity={0.4} />

            {/* Luz principal direccional */}
            <directionalLight
              position={[20, 20, 10]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            {/* Luz de relleno para suavizar sombras */}
            <directionalLight
              position={[-10, 15, -10]}
              intensity={0.6}
              color="#e0f2fe"
            />

            {/* Luz puntual superior para crear brillos */}
            <pointLight
              position={[0, 15, 0]}
              intensity={0.8}
              color="#ffffff"
            />

            {/* Luces puntuales para crear reflejos en las esferas metálicas */}
            <pointLight
              position={[10, 5, 10]}
              intensity={0.5}
              color="#60a5fa"
            />

            <pointLight
              position={[-10, 5, -10]}
              intensity={0.5}
              color="#f87171"
            />

            <Board3D />
            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              enableDamping={true}
              dampingFactor={0.08}
              minDistance={10}
              maxDistance={40}
              minPolarAngle={0.01}
              maxPolarAngle={Math.PI - 0.01}
              target={[0, 0, 0]}
            />
          </Canvas>
          <RotationControls
            onRotate={handleRotation}
            onHorizontalRotate={handleHorizontalRotation}
            onRoll={handleRoll}
            onReset={handleResetView}
          />

          {/* Selector dinámico de fichas posicionado absolutamente en el bottom */}
          <DynamicPieceSelector />
        </div>
      </div>
      <GameUI />
    </div>
  )
}
