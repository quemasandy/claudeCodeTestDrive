import type { Piece, Position } from '../types/game'

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

  // Let's create a simpler, more spaced out initial setup for testing
  // Player 1 (Red) pieces
  const player1Positions = [
    { x: 1, y: 0, z: 0 }, // Bottom level
    { x: 0, y: 1, z: 1 }, // Second level
  ]

  // Player 2 (Black) pieces
  const player2Positions = [
    { x: 2, y: 3, z: 3 }, // Top level
    { x: 3, y: 2, z: 2 }, // Third level
  ]

  // Add player 1 pieces
  player1Positions.forEach((pos, index) => {
    if (isValidSquare(pos.x, pos.y, pos.z)) {
      pieces.push({
        id: `p1-${index}`,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        player: 1,
        isKing: false
      })
    }
  })

  // Add player 2 pieces
  player2Positions.forEach((pos, index) => {
    if (isValidSquare(pos.x, pos.y, pos.z)) {
      pieces.push({
        id: `p2-${index}`,
        x: pos.x,
        y: pos.y,
        z: pos.z,
        player: 2,
        isKing: false
      })
    }
  })

  return pieces
}

/**
 * Get all valid moves for a piece
 */
export function getValidMoves(piece: Piece, allPieces: Piece[]): Position[] {
  const moves: Position[] = []
  const captures = getCaptureMoves(piece, allPieces)

  // If captures are available, only return captures (mandatory)
  if (captures.length > 0) {
    return captures
  }

  // Otherwise, return regular moves
  return getRegularMoves(piece, allPieces)
}

/**
 * Get regular (non-capture) moves for a piece
 */
export function getRegularMoves(piece: Piece, allPieces: Piece[]): Position[] {
  const moves: Position[] = []
  const { x, y, z } = piece

  // Define all possible directions where exactly 2 coordinates change by ±1
  const directions = [
    // X and Y change, Z stays same (same level moves)
    [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],
    // X and Z change, Y stays same
    [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
    // Y and Z change, X stays same
    [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1],
    // Also include 3D diagonal moves
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

    // Check if square is empty
    const pieceAtPosition = allPieces.find(p => p.x === newX && p.y === newY && p.z === newZ)
    if (pieceAtPosition) {
      continue
    }

    if (isValidDirection(piece, dx, dy, dz)) {
      moves.push({ x: newX, y: newY, z: newZ })
    }
  }
  return moves
}

/**
 * Get all possible capture moves for a piece
 */
export function getCaptureMoves(piece: Piece, allPieces: Piece[]): Position[] {
  const moves: Position[] = []
  const { x, y, z, player } = piece

  // Define diagonal directions in 3D
  const directions = [
    [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
    [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]
  ]

  for (const [dx, dy, dz] of directions) {
    const enemyX = x + dx
    const enemyY = y + dy
    const enemyZ = z + dz

    // Check if there's an enemy piece adjacent
    if (enemyX < 0 || enemyX >= 4 || enemyY < 0 || enemyY >= 4 || enemyZ < 0 || enemyZ >= 4) {
      continue
    }

    if (!isValidSquare(enemyX, enemyY, enemyZ)) {
      continue
    }

    const enemyPiece = allPieces.find(p => p.x === enemyX && p.y === enemyY && p.z === enemyZ)
    if (!enemyPiece || enemyPiece.player === player) {
      continue
    }

    // Check for valid landing positions after capture
    const landingPositions = getCaptureLandingPositions(x, y, z, enemyX, enemyY, enemyZ, allPieces)
    moves.push(...landingPositions)
  }

  return moves
}

/**
 * Get possible landing positions after capturing a piece
 * This is where the 3D innovation happens - player can choose level
 */
export function getCaptureLandingPositions(
  fromX: number, fromY: number, fromZ: number,
  enemyX: number, enemyY: number, enemyZ: number,
  allPieces: Piece[]
): Position[] {
  const positions: Position[] = []

  // Calculate the direction of the capture
  const dx = enemyX - fromX
  const dy = enemyY - fromY
  const dz = enemyZ - fromZ

  // Option 1: Continue in the same direction (traditional capture)
  const traditionalX = enemyX + dx
  const traditionalY = enemyY + dy
  const traditionalZ = enemyZ + dz

  if (traditionalX >= 0 && traditionalX < 4 && traditionalY >= 0 && traditionalY < 4 &&
      traditionalZ >= 0 && traditionalZ < 4 && isValidSquare(traditionalX, traditionalY, traditionalZ)) {
    const pieceAtTraditional = allPieces.find(p => p.x === traditionalX && p.y === traditionalY && p.z === traditionalZ)
    if (!pieceAtTraditional) {
      positions.push({ x: traditionalX, y: traditionalY, z: traditionalZ })
    }
  }

  // Option 2: 3D Innovation - Land on same XY but different level
  for (let newZ = 0; newZ < 4; newZ++) {
    if (newZ === enemyZ) continue // Skip the enemy's level

    if (isValidSquare(enemyX, enemyY, newZ)) {
      const pieceAtLevel = allPieces.find(p => p.x === enemyX && p.y === enemyY && p.z === newZ)
      if (!pieceAtLevel) {
        positions.push({ x: enemyX, y: enemyY, z: newZ })
      }
    }
  }

  return positions
}

/**
 * Check if a move direction is valid for a piece
 * Regular pieces can only move forward, kings can move in any direction
 */
function isValidDirection(piece: Piece, dx: number, dy: number, dz: number): boolean {
  if (piece.isKing) {
    return true // Kings can move in any direction
  }

  // Count how many coordinates change by exactly ±1
  const changedCoords = [dx, dy, dz].filter(d => Math.abs(d) === 1).length
  const stationaryCoords = [dx, dy, dz].filter(d => d === 0).length

  // Allow movements where exactly 2 coordinates change by ±1 and 1 stays the same
  if (changedCoords === 2 && stationaryCoords === 1) {
    return true
  }

  // Also allow 3D diagonal moves (all 3 coordinates change)
  if (changedCoords === 3 && stationaryCoords === 0) {
    return true
  }

  return false
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