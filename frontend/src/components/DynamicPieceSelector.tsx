import { useGameStore } from '../store/gameStore'
import { getValidMoves } from '../utils/gameLogic'
import type { Piece } from '../types/game'

export function DynamicPieceSelector() {
  const { pieces, selectedPiece, currentPlayer, mustCapture, selectPiece } = useGameStore()

  // Filtrar fichas del jugador actual
  const currentPlayerPieces = pieces.filter(piece => piece.player === currentPlayer)

  // Ordenar fichas por posición para mantener consistencia visual
  const sortedPieces = currentPlayerPieces.sort((a, b) => {
    if (a.z !== b.z) return a.z - b.z // Por nivel primero
    if (a.y !== b.y) return a.y - b.y // Luego por fila
    return a.x - b.x // Finalmente por columna
  })

  // Determinar qué fichas pueden moverse
  const piecesWithMoveInfo = sortedPieces.map(piece => {
    const validMoves = getValidMoves(piece, pieces, mustCapture)
    const canMove = validMoves.length > 0

    // Verificar si esta ficha puede realizar capturas
    const captureMoves = getValidMoves(piece, pieces, true)
    const hasCaptures = captureMoves.length > 0

    return {
      piece,
      canMove,
      hasCaptures,
      isSelected: selectedPiece?.id === piece.id,
      validMovesCount: validMoves.length
    }
  })

  const handlePieceClick = (piece: Piece) => {
    const pieceInfo = piecesWithMoveInfo.find(p => p.piece.id === piece.id)
    if (!pieceInfo?.canMove) return
    selectPiece(piece.id)
  }

  const getPlayerName = () => currentPlayer === 1 ? 'Rojas' : 'Negras'
  const getPlayerEmoji = () => currentPlayer === 1 ? '🔴' : '⚫'

  const canMoveCount = piecesWithMoveInfo.filter(p => p.canMove).length
  const kingsCount = currentPlayerPieces.filter(p => p.isKing).length

  return (
    <div className="dynamic-piece-selector">
      <div className="selector-header">
        <span className="player-indicator">
          {getPlayerEmoji()} Fichas {getPlayerName()}
        </span>
        <div className="piece-stats">
          <span className="stat-item">{currentPlayerPieces.length} total</span>
          <span className="stat-item">{canMoveCount} pueden moverse</span>
          {kingsCount > 0 && <span className="stat-item">{kingsCount} damas</span>}
        </div>
        <div className="turn-indicator">
          TU TURNO
        </div>
      </div>

      <div className="pieces-container">
        {piecesWithMoveInfo.map((pieceInfo) => (
          <div
            key={pieceInfo.piece.id}
            className={`piece-selector-item ${pieceInfo.isSelected ? 'selected' : ''} ${!pieceInfo.canMove ? 'disabled' : ''}`}
            onClick={() => handlePieceClick(pieceInfo.piece)}
            title={`Ficha en nivel ${pieceInfo.piece.z}, fila ${pieceInfo.piece.y}, columna ${pieceInfo.piece.x}${
              pieceInfo.piece.isKing ? ' (Dama)' : ''
            }${
              pieceInfo.canMove ? ` - ${pieceInfo.validMovesCount} movimientos disponibles` : ' - No puede moverse'
            }`}
          >
            {/* Círculo de la ficha */}
            <div className={`piece-circle player-${pieceInfo.piece.player}`}>
              {/* Coordenadas de la ficha */}
              <span className="piece-coords">
                {pieceInfo.piece.x}{pieceInfo.piece.y}
              </span>

              {/* Indicador de dama */}
              {pieceInfo.piece.isKing && (
                <div className="crown-indicator">♔</div>
              )}
            </div>

            {/* Indicadores de estado */}
            {mustCapture && pieceInfo.canMove && pieceInfo.hasCaptures && (
              <div className="capture-required-indicator" />
            )}

            {!mustCapture && pieceInfo.hasCaptures && (
              <div className="capture-available-indicator" />
            )}

            {/* Indicador de nivel (Z) */}
            {pieceInfo.piece.z > 0 && (
              <div className="level-indicator">
                L{pieceInfo.piece.z}
              </div>
            )}
          </div>
        ))}

        {currentPlayerPieces.length === 0 && (
          <div className="no-pieces-message">
            No quedan fichas {currentPlayer === 1 ? 'rojas' : 'negras'}
          </div>
        )}
      </div>
    </div>
  )
}