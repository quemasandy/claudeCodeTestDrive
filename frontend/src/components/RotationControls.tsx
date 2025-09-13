interface RotationControlsProps {
  onRotate: (direction: 'left' | 'right' | 'up' | 'down') => void
  onHorizontalRotate: (direction: 'clockwise' | 'counterclockwise') => void
  onRoll?: (direction: 'left' | 'right') => void
  onReset?: () => void
}

export function RotationControls({ onRotate, onHorizontalRotate, onRoll, onReset }: RotationControlsProps) {
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

      {/* Botones de giro horario y antihorario (yaw) */}
      <div className="rotation-horizontal-spin">
        <button
          className="rotation-btn rotation-counterclockwise"
          onClick={() => onHorizontalRotate('counterclockwise')}
          title="Girar tablero antihorario"
          aria-label="Girar tablero antihorario"
        >
          ↺
        </button>
        <button
          className="rotation-btn rotation-clockwise"
          onClick={() => onHorizontalRotate('clockwise')}
          title="Girar tablero horario"
          aria-label="Girar tablero horario"
        >
          ↻
        </button>
      </div>

      {/* Controles extra: roll y reset vista */}
      <div className="rotation-extras">
        <button
          className="rotation-btn rotation-roll-left"
          onClick={() => onRoll?.('left')}
          title="Inclinar cámara a la izquierda (roll)"
        >
          ⤿
        </button>
        <button
          className="rotation-btn rotation-roll-right"
          onClick={() => onRoll?.('right')}
          title="Inclinar cámara a la derecha (roll)"
        >
          ⤾
        </button>
        <button
          className="rotation-btn rotation-reset"
          onClick={() => onReset?.()}
          title="Resetear vista"
        >
          ⟳
        </button>
      </div>
    </div>
  )
}
