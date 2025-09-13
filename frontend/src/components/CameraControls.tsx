import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraControlsProps {
  onRotate: (direction: 'left' | 'right' | 'up' | 'down') => void
}

export function CameraControls({ onRotate }: CameraControlsProps) {
  const { camera } = useThree()
  const rotationSpeed = 0.02
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

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
        targetRotation.current.x = Math.max(-Math.PI / 2, targetRotation.current.x - step)
        break
      case 'down':
        targetRotation.current.x = Math.min(Math.PI / 2, targetRotation.current.x + step)
        break
    }
    onRotate(direction)
  }, [onRotate])

  useFrame(() => {
    // Smooth camera rotation
    const lerpFactor = 0.1
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor

    // Calculate camera position based on spherical coordinates
    const distance = 25
    const x = distance * Math.cos(currentRotation.current.x) * Math.cos(currentRotation.current.y)
    const y = distance * Math.sin(currentRotation.current.x)
    const z = distance * Math.cos(currentRotation.current.x) * Math.sin(currentRotation.current.y)

    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
  })

  // This component doesn't render anything visible
  return null
}

// Export the rotation function for use by UI buttons
export const useCameraRotation = () => {
  const { camera } = useThree()
  const targetRotation = useRef<{ x: number; y: number }>({ x: Math.PI / 4, y: Math.PI / 4 })

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

    // Apply rotation immediately for responsive feel
    const distance = 25
    const x = distance * Math.cos(targetRotation.current.x) * Math.cos(targetRotation.current.y)
    const y = distance * Math.sin(targetRotation.current.x)
    const z = distance * Math.cos(targetRotation.current.x) * Math.sin(targetRotation.current.y)

    camera.position.set(x, y, z)
    camera.lookAt(0, 0, 0)
  }, [camera])

  return rotateCamera
}