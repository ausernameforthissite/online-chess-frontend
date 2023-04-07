import { ChessColor } from "./ChessCommon";

export interface IChessMatchResult {
  technicalFinish: boolean
  draw: boolean
  winnerColor: ChessColor;
  message: string

  whiteTimeLeftMS: number
  blackTimeLeftMS: number
}


