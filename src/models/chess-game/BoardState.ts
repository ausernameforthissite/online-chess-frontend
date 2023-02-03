import { ChessPiece } from "./ChessPiece"
import { PossibleMoveCell } from "./PossibleMoveCell"


export type BoardState = Array<Array<ChessPiece | PossibleMoveCell | null>>