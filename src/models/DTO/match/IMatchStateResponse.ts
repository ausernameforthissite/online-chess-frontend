import { IChessMove } from "../../chess-game/IChessMove"
import { IMatch } from "../../chess-game/IMatch"

export interface IMatchStateResponse {
  match: IMatch
  matchRecord: Array<IChessMove>
}