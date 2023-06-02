import { IChessGameResult } from "../../chess-game/IChessGameResult"
import { IChessMoveFullData } from "../../chess-game/IChessMove"
import { IUsersInGame } from "../../chess-game/IUsersInGame"

export interface IGameStateResponse {
  finished: boolean
  usersInGame: IUsersInGame
  gameResult: IChessGameResult
  gameRecord: Array<IChessMoveFullData>
}