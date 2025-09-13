interface RotationControlsProps {
  onRotate: (direction: 'left' | 'right' | 'up' | 'down') => void
}

export function RotationControls({ onRotate }: RotationControlsProps) {
  return (
    <div className="rotation-controls">
      {/* Top arrow */}
      <button
        className="rotation-btn rotation-up"
        onClick={() => onRotate('up')}
        title="Rotar hacia arriba"
      >
        ↑
      </button>

      {/* Left and Right arrows */}
      <div className="rotation-horizontal">
        <button
          className="rotation-btn rotation-left"
          onClick={() => onRotate('left')}
          title="Rotar hacia la izquierda"
        >
          ←
        </button>

        <button
          className="rotation-btn rotation-right"
          onClick={() => onRotate('right')}
          title="Rotar hacia la derecha"
        >
          →
        </button>
      </div>

      {/* Bottom arrow */}
      <button
        className="rotation-btn rotation-down"
        onClick={() => onRotate('down')}
        title="Rotar hacia abajo"
      >
        ↓
      </button>
    </div>
  )
}