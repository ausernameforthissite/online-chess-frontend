import { BoardState } from "./BoardState"
import { ChessColor, IChessCoords } from "./ChessCommon"
import { UsersInMatch } from "./UsersInMatch"

export interface IMatch {
  id: number
  myMatch?: boolean
  myTurn?: boolean
  myColor: ChessColor
  finished: boolean
  usersInMatch: UsersInMatch
  enPassantPawnCoords: IChessCoords
  boardState: BoardState
}