import { create } from 'zustand'
import type { GameState, Piece, Position } from '../types/game'
import { isValidSquare, getValidMoves, getCaptureMoves, initializePieces, shouldCrown } from '../utils/gameLogic'

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

    const validMoves = getValidMoves(piece, state.pieces, state.mustCapture)

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
    let movedPiece = { ...selectedPiece, x: to.x, y: to.y, z: to.z }

    // Check if piece should be crowned
    if (shouldCrown(movedPiece)) {
      movedPiece = { ...movedPiece, isKing: true }
    }

    // Update pieces array
    let updatedPieces = state.pieces.map(piece =>
      piece.id === selectedPiece.id ? movedPiece : piece
    )

    // Remove captured piece if any
    if (capturedPiece) {
      updatedPieces = updatedPieces.filter(piece => piece.id !== capturedPiece.id)
    }

    // Check for additional captures from new position
    const additionalCaptures = getCaptureMoves(movedPiece, updatedPieces)
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
  // Find which piece is being jumped over by checking all enemy pieces
  // adjacent to the from position in the direction of the move

  for (const piece of allPieces) {
    if (piece.id === fromPiece.id || piece.player === fromPiece.player) {
      continue
    }

    // Check if this piece is adjacent to the from position
    const dx = piece.x - fromPiece.x
    const dy = piece.y - fromPiece.y
    const dz = piece.z - fromPiece.z

    // Must be adjacent (distance of 1 in valid directions)
    const changedCoords = [dx, dy, dz].filter(d => Math.abs(d) === 1).length
    const stationaryCoords = [dx, dy, dz].filter(d => d === 0).length

    if ((changedCoords === 2 && stationaryCoords === 1) || (changedCoords === 3 && stationaryCoords === 0)) {
      // Check if the destination is in the same direction from the enemy piece
      const toDx = to.x - piece.x
      const toDy = to.y - piece.y
      const toDz = to.z - piece.z

      // The destination should be in the same direction from the enemy piece
      // Either the traditional jump (same direction) or the 3D innovation (different level)
      if ((Math.sign(dx) === Math.sign(toDx) && Math.sign(dy) === Math.sign(toDy) && Math.sign(dz) === Math.sign(toDz)) ||
          (to.x === piece.x && to.y === piece.y && to.z !== piece.z)) {
        return piece
      }
    }
  }

  return null
}

export const board = Array.from({ length: 8 }, (_, x) =>
  Array.from({ length: 8 }, (_, y) =>
    Array.from({ length: 8 }, (_, z) => ({
      x,
      y,
      z,
      isValid: isValidSquare(x, y, z),
      piece: null as Piece | null
    }))
  )
)