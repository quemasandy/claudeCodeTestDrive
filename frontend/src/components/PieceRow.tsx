import { useGameStore } from '../store/gameStore'
import { getValidMoves } from '../utils/gameLogic'
import { PieceSelector } from './PieceSelector'
import type { Piece } from '../types/game'

interface PieceRowProps {
  player: 1 | 2
  title: string
  position: 'top' | 'bottom'
}

export function PieceRow({ player, title, position }: PieceRowProps) {
  const { pieces, selectedPiece, currentPlayer, mustCapture } = useGameStore()

  // Filtrar fichas del jugador
  const playerPieces = pieces.filter(piece => piece.player === player)

  // Ordenar fichas por posición para mantener consistencia visual
  const sortedPieces = playerPieces.sort((a, b) => {
    if (a.z !== b.z) return a.z - b.z // Por nivel primero
    if (a.y !== b.y) return a.y - b.y // Luego por fila
    return a.x - b.x // Finalmente por columna
  })

  // Determinar qué fichas pueden moverse
  const piecesWithMoveInfo = sortedPieces.map(piece => {
    const validMoves = getValidMoves(piece, pieces, mustCapture)
    const canMove = validMoves.length > 0 && piece.player === currentPlayer

    return {
      piece,
      canMove,
      isSelected: selectedPiece?.id === piece.id
    }
  })

  const rowStyle = {
    padding: '10px',
    backgroundColor: position === 'top' ? 'rgba(15, 23, 42, 0.4)' : 'rgba(15, 23, 42, 0.6)',
    borderRadius: '8px',
    margin: '10px 0',
    border: `1px solid rgba(${player === 1 ? '239, 68, 68' : '100, 116, 139'}, 0.3)`
  }

  const titleStyle = {
    color: player === 1 ? '#ef4444' : '#f1f5f9',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  const scrollContainerStyle = {
    display: 'flex',
    overflowX: 'auto' as const,
    gap: '4px',
    padding: '5px',
    scrollbarWidth: 'thin' as const,
    scrollbarColor: `${player === 1 ? '#ef4444' : '#64748b'} transparent`
  }

  const countInfo = {
    total: playerPieces.length,
    canMove: piecesWithMoveInfo.filter(p => p.canMove).length,
    kings: playerPieces.filter(p => p.isKing).length
  }

  return (
    <div style={rowStyle}>
      <div style={titleStyle}>
        <span>{title}</span>
        <span style={{ fontSize: '12px', opacity: 0.8 }}>
          ({countInfo.total} fichas, {countInfo.canMove} pueden moverse, {countInfo.kings} damas)
        </span>
        {currentPlayer === player && (
          <span style={{
            backgroundColor: player === 1 ? '#ef4444' : '#3b82f6',
            color: 'white',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '10px'
          }}>
            TU TURNO
          </span>
        )}
      </div>

      <div style={scrollContainerStyle}>
        {piecesWithMoveInfo.map((pieceInfo, index) => (
          <PieceSelector
            key={pieceInfo.piece.id}
            piece={pieceInfo.piece}
            isSelected={pieceInfo.isSelected}
            canMove={pieceInfo.canMove}
            index={index}
          />
        ))}

        {playerPieces.length === 0 && (
          <div style={{
            padding: '20px',
            textAlign: 'center' as const,
            color: '#6b7280',
            fontSize: '14px',
            fontStyle: 'italic'
          }}>
            No quedan fichas {player === 1 ? 'rojas' : 'negras'}
          </div>
        )}
      </div>
    </div>
  )
}