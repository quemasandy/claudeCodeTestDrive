import { useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { getValidMoves } from '../utils/gameLogic'
import type { Piece } from '../types/game'

interface PieceSelectorProps {
  piece: Piece
  isSelected: boolean
  canMove: boolean
  index: number
}

export function PieceSelector({ piece, isSelected, canMove, index }: PieceSelectorProps) {
  const [hovered, setHovered] = useState(false)
  const { selectPiece, currentPlayer, mustCapture, pieces } = useGameStore()

  // Verificar si esta ficha puede realizar capturas
  const hasCaptures = () => {
    const validMoves = getValidMoves(piece, pieces, false)
    const captureMoves = getValidMoves(piece, pieces, true)
    return captureMoves.length > 0
  }

  const handleClick = () => {
    if (!canMove || piece.player !== currentPlayer) return
    selectPiece(piece.id)
  }

  const getBaseColor = () => {
    return piece.player === 1 ? '#dc2626' : '#1f2937'
  }

  const getBorderColor = () => {
    if (isSelected) return piece.player === 1 ? '#fbbf24' : '#60a5fa'
    if (!canMove) return '#6b7280'
    if (hovered) return piece.player === 1 ? '#ef4444' : '#374151'
    return 'transparent'
  }

  const getOpacity = () => {
    if (!canMove) return 0.3
    if (isSelected) return 1
    if (hovered) return 0.9
    return 0.7
  }

  const pieceStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: getBaseColor(),
    border: `3px solid ${getBorderColor()}`,
    opacity: getOpacity(),
    cursor: canMove ? 'pointer' : 'not-allowed',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2px',
    boxShadow: isSelected
      ? `0 0 15px ${piece.player === 1 ? '#fbbf24' : '#60a5fa'}80`
      : hovered
        ? '0 4px 8px rgba(0,0,0,0.3)'
        : '0 2px 4px rgba(0,0,0,0.2)',
    transform: isSelected ? 'scale(1.1)' : hovered ? 'scale(1.05)' : 'scale(1)'
  }

  const crownStyle = {
    position: 'absolute' as const,
    top: '-2px',
    right: '-2px',
    width: '12px',
    height: '12px',
    backgroundColor: piece.player === 1 ? '#fbbf24' : '#60a5fa',
    borderRadius: '50%',
    border: '1px solid white',
    fontSize: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  }

  const coordText = {
    fontSize: '8px',
    color: piece.player === 1 ? '#ffffff' : '#d1d5db',
    fontWeight: 'bold' as const,
    textShadow: '1px 1px 1px rgba(0,0,0,0.8)'
  }

  return (
    <div
      style={pieceStyle}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`Ficha en (${piece.x},${piece.y},${piece.z}) - ${canMove ? 'Puede moverse' : 'Bloqueada'}`}
    >
      {/* Coordenadas de la ficha */}
      <span style={coordText}>
        {piece.x}{piece.y}
      </span>

      {/* Indicador de dama */}
      {piece.isKing && (
        <div style={crownStyle}>
          ♔
        </div>
      )}

      {/* Indicador de captura obligatoria */}
      {mustCapture && canMove && hasCaptures() && (
        <div style={{
          position: 'absolute',
          top: '-5px',
          left: '-5px',
          width: '50px',
          height: '50px',
          border: '2px solid #ef4444',
          borderRadius: '50%',
          animation: 'pulse 1s infinite'
        }} />
      )}

      {/* Indicador de ficha con capturas disponibles */}
      {!mustCapture && canMove && hasCaptures() && (
        <div style={{
          position: 'absolute',
          bottom: '-2px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '8px',
          height: '8px',
          backgroundColor: '#ef4444',
          borderRadius: '50%',
          border: '1px solid white'
        }} />
      )}
    </div>
  )
}