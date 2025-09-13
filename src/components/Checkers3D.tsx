import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Board3D } from './Board3D'
import { GameUI } from './GameUI'
import { useGameStore } from '../store/gameStore'

export function Checkers3D() {
  const currentPlayer = useGameStore((state) => state.currentPlayer)

  return (
    <div className="checkers-3d">
      <div className="game-canvas">
        <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Board3D />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={20}
          />
        </Canvas>
      </div>
      <GameUI />
    </div>
  )
}