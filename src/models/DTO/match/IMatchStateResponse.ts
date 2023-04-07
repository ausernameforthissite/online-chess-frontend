import { IChessMatchResult } from "../../chess-game/IChessMatchResult"
import { IChessMoveFullData } from "../../chess-game/IChessMove"
import { IUsersInMatch } from "../../chess-game/IUsersInMatch"

export interface IMatchStateResponse {
  finished: boolean
  usersInMatch: IUsersInMatch
  matchResult: IChessMatchResult
  matchRecord: Array<IChessMoveFullData>
}