import { create } from 'zustand'
import type { GameState, Piece, Position } from '../types/game'
import { isValidSquare, getValidMoves, initializePieces } from '../utils/gameLogic'

interface GameStore extends GameState {
  selectPiece: (pieceId: string) => void
  selectSquare: (x: number, y: number, z: number) => void
  movePiece: (to: Position) => void
  resetGame: () => void
}

const initialState: GameState = {
  currentPlayer: 1,
  pieces: initializePieces(),
  selectedPiece: null,
  selectedSquare: null,
  validMoves: [],
  gameState: 'playing',
  mustCapture: false,
  captureSequence: []
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  selectPiece: (pieceId: string) => {
    const state = get()
    const piece = state.pieces.find(p => p.id === pieceId)

    if (!piece || piece.player !== state.currentPlayer) {
      return
    }

    const validMoves = getValidMoves(piece, state.pieces)

    set({
      selectedPiece: piece,
      selectedSquare: null,
      validMoves
    })
  },

  selectSquare: (x: number, y: number, z: number) => {
    const state = get()

    if (!state.selectedPiece) {
      // Try to select a piece at this position
      const piece = state.pieces.find(p => p.x === x && p.y === y && p.z === z)
      if (piece && piece.player === state.currentPlayer) {
        get().selectPiece(piece.id)
      }
      return
    }

    // Check if this is a valid move
    const isValidMove = state.validMoves.some(move =>
      move.x === x && move.y === y && move.z === z
    )

    if (isValidMove) {
      get().movePiece({ x, y, z })
    } else {
      // Deselect
      set({
        selectedPiece: null,
        selectedSquare: null,
        validMoves: []
      })
    }
  },

  movePiece: (to: Position) => {
    const state = get()
    const { selectedPiece } = state

    if (!selectedPiece) return

    // Check if this is a capture move
    const capturedPiece = findCapturedPiece(selectedPiece, to, state.pieces)

    // Move the piece
    const movedPiece = { ...selectedPiece, x: to.x, y: to.y, z: to.z }

    // Update pieces array
    let updatedPieces = state.pieces.map(piece =>
      piece.id === selectedPiece.id ? movedPiece : piece
    )

    // Remove captured piece if any
    if (capturedPiece) {
      updatedPieces = updatedPieces.filter(piece => piece.id !== capturedPiece.id)
    }

    // Check for additional captures from new position
    const additionalCaptures = getValidMoves(movedPiece, updatedPieces)
    const hasMoreCaptures = additionalCaptures.length > 0 && capturedPiece

    if (hasMoreCaptures) {
      // Continue with same player for multiple captures
      set({
        pieces: updatedPieces,
        selectedPiece: movedPiece,
        validMoves: additionalCaptures,
        mustCapture: true
      })
    } else {
      // Switch turns
      const nextPlayer = state.currentPlayer === 1 ? 2 : 1

      set({
        pieces: updatedPieces,
        selectedPiece: null,
        selectedSquare: null,
        validMoves: [],
        currentPlayer: nextPlayer,
        mustCapture: false
      })
    }
  },

  resetGame: () => {
    set({
      ...initialState,
      pieces: initializePieces()
    })
  }
}))

// Helper function to find captured piece during a move
function findCapturedPiece(fromPiece: Piece, to: Position, allPieces: Piece[]): Piece | null {
  const dx = to.x - fromPiece.x
  const dy = to.y - fromPiece.y
  const dz = to.z - fromPiece.z

  // Check if this is a capture move (distance > 1 in any direction)
  if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && Math.abs(dz) <= 1) {
    return null // Not a capture move
  }

  // Check all pieces between from and to positions
  for (const piece of allPieces) {
    if (piece.id === fromPiece.id || piece.player === fromPiece.player) {
      continue
    }

    // Check if piece is in the path and adjacent to from position
    const toPieceX = piece.x - fromPiece.x
    const toPieceY = piece.y - fromPiece.y
    const toPieceZ = piece.z - fromPiece.z

    // Check if it's adjacent and in the same direction
    if (Math.abs(toPieceX) === 1 && Math.abs(toPieceY) === 1 && Math.abs(toPieceZ) === 1) {
      const directionX = Math.sign(dx)
      const directionY = Math.sign(dy)
      const directionZ = Math.sign(dz)

      if (Math.sign(toPieceX) === directionX &&
          Math.sign(toPieceY) === directionY &&
          Math.sign(toPieceZ) === directionZ) {
        return piece
      }
    }

    // Check if piece is at the same XY as destination (3D innovation)
    if (piece.x === to.x && piece.y === to.y && piece.z !== to.z) {
      // Check if this piece is adjacent to the from position
      if (Math.abs(piece.x - fromPiece.x) === 1 &&
          Math.abs(piece.y - fromPiece.y) === 1 &&
          Math.abs(piece.z - fromPiece.z) === 1) {
        return piece
      }
    }
  }

  return null
}

export const board = Array.from({ length: 4 }, (_, x) =>
  Array.from({ length: 4 }, (_, y) =>
    Array.from({ length: 4 }, (_, z) => ({
      x,
      y,
      z,
      isValid: isValidSquare(x, y, z),
      piece: null as Piece | null
    }))
  )
)