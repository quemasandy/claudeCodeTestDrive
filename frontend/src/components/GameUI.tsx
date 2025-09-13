import { useGameStore } from '../store/gameStore'

export function GameUI() {
  const { currentPlayer, gameState, resetGame, mustCapture, selectedPiece, validMoves, pieces } = useGameStore()

  const getPlayerName = (player: number) => player === 1 ? 'Rojo' : 'Negro'

  // Count pieces for each player
  const player1Pieces = pieces.filter(p => p.player === 1).length
  const player2Pieces = pieces.filter(p => p.player === 2).length

  // Count captures vs regular moves
  const captureCount = selectedPiece ? validMoves.length : 0
  const hasCaptures = mustCapture || (selectedPiece && captureCount > 0)

  return (
    <div className="game-ui">
      <div className="game-info">
        <h1>Damas 3D</h1>

        <div className="current-turn">
          <h2>Turno: {getPlayerName(currentPlayer)}</h2>
        </div>

        <div className="piece-count">
          <div className="player-stats">
            <span className="player-1">🔴 Rojas: {player1Pieces}</span>
            <span className="player-2">⚫ Negras: {player2Pieces}</span>
          </div>
        </div>

        <div className="game-status">
          {gameState === 'playing' && !selectedPiece && <p>Selecciona una pieza para mover</p>}
          {gameState === 'playing' && selectedPiece && !hasCaptures && (
            <div>
              <p>Movimientos disponibles: {validMoves.length}</p>
              {selectedPiece && (
                <div className="debug-info">
                  <small>Debug: Pieza en ({selectedPiece.x}, {selectedPiece.y}, {selectedPiece.z}) - Jugador {selectedPiece.player}</small>
                  <br />
                  <small>Casilla válida: {(selectedPiece.x + selectedPiece.y + selectedPiece.z) % 2 === 1 ? 'Sí' : 'No'}</small>
                  {validMoves.length === 0 && (
                    <div style={{color: '#fbbf24', marginTop: '0.5rem'}}>
                      <small>⚠️ No hay movimientos válidos. Intenta con otra pieza.</small>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {gameState === 'playing' && hasCaptures && (
            <div className="capture-status">
              <p><strong>¡Captura obligatoria!</strong></p>
              <p>Opciones de captura: {captureCount}</p>
              <p className="capture-help">🔴 Rojo = Captura | 🟡 Amarillo = Movimiento</p>
            </div>
          )}
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