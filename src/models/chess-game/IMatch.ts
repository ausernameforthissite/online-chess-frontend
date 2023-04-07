import { BoardState } from "./BoardState"
import { IChessCoords } from "./ChessCommon"
import { IChessMatchResult } from "./IChessMatchResult"
import { IUsersInMatch } from "./IUsersInMatch"

export interface IMatch {
  usersInMatch: IUsersInMatch
  enPassantPawnCoords: IChessCoords | null
  boardState: BoardState
  result: IChessMatchResult | null
}