import { create } from 'zustand'
import { GameState, Piece, Position } from '../types/game'
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

    // Create updated pieces array
    const updatedPieces = state.pieces.map(piece =>
      piece.id === selectedPiece.id
        ? { ...piece, x: to.x, y: to.y, z: to.z }
        : piece
    )

    // Check for captures (simple implementation for now)
    const capturedPieces = updatedPieces.filter(piece =>
      piece.id !== selectedPiece.id &&
      Math.abs(piece.x - selectedPiece.x) === 1 &&
      Math.abs(piece.y - selectedPiece.y) === 1 &&
      Math.abs(piece.z - selectedPiece.z) === 1 &&
      piece.player !== selectedPiece.player
    )

    const finalPieces = updatedPieces.filter(piece =>
      !capturedPieces.some(captured => captured.id === piece.id)
    )

    // Switch turns
    const nextPlayer = state.currentPlayer === 1 ? 2 : 1

    set({
      pieces: finalPieces,
      selectedPiece: null,
      selectedSquare: null,
      validMoves: [],
      currentPlayer: nextPlayer
    })
  },

  resetGame: () => {
    set(initialState)
  }
}))

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