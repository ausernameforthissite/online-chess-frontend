import { BoardState } from "./BoardState"
import { IChessCoords } from "./ChessCommon"
import { IChessGameResult } from "./IChessGameResult"
import { IUsersInGame } from "./IUsersInGame"


export interface IGame {
  usersInGame: IUsersInGame
  enPassantPawnCoords: IChessCoords | null
  boardState: BoardState
  result: IChessGameResult | null
}