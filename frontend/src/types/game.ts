export interface Position {
  x: number
  y: number
  z: number
}

export interface Piece {
  id: string
  x: number
  y: number
  z: number
  player: 1 | 2
  isKing: boolean
}

export interface Move {
  from: Position
  to: Position
  capturedPieceId?: string
  captureOptions?: Position[] // For when player can choose level after capture
}

export interface GameState {
  currentPlayer: 1 | 2
  pieces: Piece[]
  selectedPiece: Piece | null
  selectedSquare: Position | null
  validMoves: Position[]
  gameState: 'playing' | 'player1_wins' | 'player2_wins'
  mustCapture: boolean
  captureSequence: Move[]
}

export type CaptureOption = {
  position: Position
  capturedPieceId: string
}