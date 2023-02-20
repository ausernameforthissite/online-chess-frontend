import { BoardState } from "./BoardState"
import { IChessCoords } from "./ChessCommon"
import { IUsersInMatch } from "./IUsersInMatch"

export interface IMatch {
  id: number
  finished: boolean
  usersInMatch: IUsersInMatch
  enPassantPawnCoords: IChessCoords | null
  boardState: BoardState
}