import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Board3D } from './Board3D'
import { GameUI } from './GameUI'
import { RotationControls } from './RotationControls'
import { useGameStore } from '../store/gameStore'
import { useRef, useCallback, useEffect, forwardRef, useImperativeHandle } from 'react'

interface CameraControllerRef {
  rotate: (direction: 'left' | 'right' | 'up' | 'down') => void
}

const CameraController = forwardRef<CameraControllerRef>((props, ref) => {
  const { camera } = useThree()
  const targetRotation = useRef<{ x: number; y: number }>({ x: Math.PI / 6, y: Math.PI / 4 })

  const rotateCamera = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    const step = Math.PI / 8 // 22.5 degrees per step

    switch (direction) {
      case 'left':
        targetRotation.current.y += step
        break
      case 'right':
        targetRotation.current.y -= step
        break
      case 'up':
        targetRotation.current.x = Math.max(-Math.PI / 2 + 0.1, targetRotation.current.x - step)
        break
      case 'down':
        targetRotation.current.x = Math.min(Math.PI / 2 - 0.1, targetRotation.current.x + step)
        break
    }

    // Apply rotation
    const distance = 30
    const x = distance * Math.cos(targetRotation.current.x) * Math.cos(targetRotation.current.y)
    const y = distance * Math.sin(targetRotation.current.x)
    const z = distance * Math.cos(targetRotation.current.x) * Math.sin(targetRotation.current.y)

    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
  }, [camera])

  useImperativeHandle(ref, () => ({
    rotate: rotateCamera
  }), [rotateCamera])

  return null
})

export function Checkers3D() {
  const cameraControllerRef = useRef<CameraControllerRef>(null)

  const handleRotation = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    cameraControllerRef.current?.rotate(direction)
  }, [])

  return (
    <div className="checkers-3d">
      <div className="game-canvas">
        <Canvas camera={{ position: [25, 15, 25], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[20, 20, 10]} intensity={1} />
          <Board3D />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={15}
            maxDistance={50}
            target={[0, 0, 0]}
          />
          <CameraController ref={cameraControllerRef} />
        </Canvas>
        <RotationControls onRotate={handleRotation} />
      </div>
      <GameUI />
    </div>
  )
}