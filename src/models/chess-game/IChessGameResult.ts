import { ChessColor } from "./ChessCommon";

export interface IChessGameResult {
  technicalFinish: boolean
  draw: boolean
  winnerColor: ChessColor;
  message: string

  whiteTimeLeftMS: number
  blackTimeLeftMS: number
}