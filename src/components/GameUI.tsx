import { useGameStore } from '../store/gameStore'

export function GameUI() {
  const { currentPlayer, gameState, resetGame } = useGameStore()

  const getPlayerName = (player: number) => player === 1 ? 'Rojo' : 'Negro'

  return (
    <div className="game-ui">
      <div className="game-info">
        <h1>Damas 3D</h1>

        <div className="current-turn">
          <h2>Turno: {getPlayerName(currentPlayer)}</h2>
        </div>

        <div className="game-status">
          {gameState === 'playing' && <p>Selecciona una pieza para mover</p>}
          {gameState === 'player1_wins' && <p>¡Jugador Rojo gana!</p>}
          {gameState === 'player2_wins' && <p>¡Jugador Negro gana!</p>}
        </div>

        <div className="controls">
          <button onClick={resetGame}>Nuevo Juego</button>
        </div>

        <div className="instructions">
          <h3>Controles:</h3>
          <ul>
            <li>Click izquierdo: Seleccionar pieza/casilla</li>
            <li>Arrastrar: Rotar cámara</li>
            <li>Scroll: Zoom</li>
            <li>Click derecho + arrastrar: Mover vista</li>
          </ul>
        </div>
      </div>
    </div>
  )
}