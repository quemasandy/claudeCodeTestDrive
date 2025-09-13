import { useGameStore } from '../store/gameStore'
import { getValidMoves, getCaptureMoves } from '../utils/gameLogic'
import type { Piece } from '../types/game'

export function DynamicPieceSelector() {
  const { pieces, selectedPiece, currentPlayer, mustCapture, selectPiece, validMoves, movePiece, clearSelection } = useGameStore()

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

  // Agrupar movimientos válidos por nivel para el menú
  const groupedMoves = (selectedPiece ? validMoves : []).reduce<Record<number, { x: number, y: number, z: number }[]>>((acc, m) => {
    if (!acc[m.z]) acc[m.z] = []
    acc[m.z].push(m)
    return acc
  }, {})

  const captureSet = new Set(
    selectedPiece ? getCaptureMoves(selectedPiece, pieces).map(m => `${m.x}-${m.y}-${m.z}`) : []
  )

  const handleMoveClick = (x: number, y: number, z: number) => {
    movePiece({ x, y, z })
  }

  const getDirectionIcon = (x: number, y: number, z: number) => {
    if (!selectedPiece) return ''
    const dx = x - selectedPiece.x
    const dy = y - selectedPiece.y
    const dz = z - selectedPiece.z
    const horiz = dx >= 1 && dy >= 1 ? '↗' : dx >= 1 && dy <= -1 ? '↘' : dx <= -1 && dy <= -1 ? '↙' : dx <= -1 && dy >= 1 ? '↖' : '•'
    const vert = dz > 0 ? '↑' : dz < 0 ? '↓' : ''
    return `${horiz}${vert}`
  }

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

      {/* Menú de movimientos para la pieza seleccionada */}
      {selectedPiece && (
        <div className="moves-menu">
          <div className="moves-actions" style={{width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '4px'}}>
            <span style={{fontSize:'12px', color:'rgba(241,245,249,.85)'}}>Movimientos disponibles</span>
            <button className="move-chip" onClick={clearSelection} title="Cancelar selección">✕ Cancelar</button>
          </div>
          {Object.keys(groupedMoves).length === 0 ? (
            <div className="no-moves">No hay movimientos disponibles para esta ficha</div>
          ) : (
            Object.entries(groupedMoves)
              .sort((a, b) => Number(a[0]) - Number(b[0]))
              .map(([z, moves]) => (
                <div className="move-group" key={`group-${z}`}>
                  <span className="move-group-title">Nivel {z}:</span>
                  <div className="move-chips">
                    {moves
                      .sort((a, b) => a.y - b.y || a.x - b.x)
                      .map((m, i) => {
                        const isCap = captureSet.has(`${m.x}-${m.y}-${m.z}`)
                        return (
                          <button
                            key={`mv-${z}-${i}`}
                            className={`move-chip ${isCap ? 'capture' : ''}`}
                            title={isCap ? `Captura en (${m.x},${m.y},${m.z})` : `Mover a (${m.x},${m.y},${m.z})`}
                            onClick={() => handleMoveClick(m.x, m.y, m.z)}
                          >
                            {getDirectionIcon(m.x, m.y, m.z)} {m.x},{m.y}
                            {isCap && <span className="cap-dot">●</span>}
                          </button>
                        )
                      })}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  )
}
