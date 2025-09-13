import { Piece, Position } from '../types/game'

/**
 * Check if a square is valid (dark square in 3D checkers)
 * Valid squares have odd sum of coordinates (x + y + z)
 */
export function isValidSquare(x: number, y: number, z: number): boolean {
  return (x + y + z) % 2 === 1
}

/**
 * Initialize pieces for both players in starting positions
 */
export function initializePieces(): Piece[] {
  const pieces: Piece[] = []

  // Player 1 (Red) - starts at bottom levels
  // Level 0: First row
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (isValidSquare(x, y, 0) && y === 0) {
        pieces.push({
          id: `p1-${x}-${y}-0`,
          x,
          y,
          z: 0,
          player: 1,
          isKing: false
        })
      }
    }
  }

  // Level 1: Second row
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (isValidSquare(x, y, 1) && y === 1) {
        pieces.push({
          id: `p1-${x}-${y}-1`,
          x,
          y,
          z: 1,
          player: 1,
          isKing: false
        })
      }
    }
  }

  // Player 2 (Black) - starts at top levels
  // Level 3: Top row
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (isValidSquare(x, y, 3) && y === 3) {
        pieces.push({
          id: `p2-${x}-${y}-3`,
          x,
          y,
          z: 3,
          player: 2,
          isKing: false
        })
      }
    }
  }

  // Level 2: Second row from top
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      if (isValidSquare(x, y, 2) && y === 2) {
        pieces.push({
          id: `p2-${x}-${y}-2`,
          x,
          y,
          z: 2,
          player: 2,
          isKing: false
        })
      }
    }
  }

  return pieces
}

/**
 * Get all valid moves for a piece
 */
export function getValidMoves(piece: Piece, allPieces: Piece[]): Position[] {
  const moves: Position[] = []
  const { x, y, z, player, isKing } = piece

  // Define diagonal directions in 3D
  const directions = [
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
  ]

  for (const [dx, dy, dz] of directions) {
    const newX = x + dx
    const newY = y + dy
    const newZ = z + dz

    // Check bounds
    if (newX < 0 || newX >= 4 || newY < 0 || newY >= 4 || newZ < 0 || newZ >= 4) {
      continue
    }

    // Check if square is valid (dark)
    if (!isValidSquare(newX, newY, newZ)) {
      continue
    }

    // Check if square is occupied
    const pieceAtPosition = allPieces.find(p => p.x === newX && p.y === newY && p.z === newZ)
    if (!pieceAtPosition) {
      // Regular move
      if (isValidDirection(piece, dx, dy, dz)) {
        moves.push({ x: newX, y: newY, z: newZ })
      }
    } else if (pieceAtPosition.player !== player) {
      // Possible capture
      const captureX = newX + dx
      const captureY = newY + dy
      const captureZ = newZ + dz

      if (captureX >= 0 && captureX < 4 && captureY >= 0 && captureY < 4 &&
          captureZ >= 0 && captureZ < 4 && isValidSquare(captureX, captureY, captureZ)) {
        const pieceAtCapture = allPieces.find(p => p.x === captureX && p.y === captureY && p.z === captureZ)
        if (!pieceAtCapture) {
          moves.push({ x: captureX, y: captureY, z: captureZ })
        }
      }
    }
  }

  return moves
}

/**
 * Check if a move direction is valid for a piece
 * Regular pieces can only move forward, kings can move in any direction
 */
function isValidDirection(piece: Piece, dx: number, dy: number, dz: number): boolean {
  if (piece.isKing) {
    return true // Kings can move in any direction
  }

  // Regular pieces move toward opponent's side
  if (piece.player === 1) {
    // Player 1 moves toward higher y and z values
    return dy >= 0 || dz >= 0
  } else {
    // Player 2 moves toward lower y and z values
    return dy <= 0 || dz <= 0
  }
}

/**
 * Check if a piece should be crowned (reached the opposite end)
 */
export function shouldCrown(piece: Piece): boolean {
  if (piece.isKing) return false

  if (piece.player === 1) {
    // Player 1 crowns at y=3 or z=3
    return piece.y === 3 || piece.z === 3
  } else {
    // Player 2 crowns at y=0 or z=0
    return piece.y === 0 || piece.z === 0
  }
}