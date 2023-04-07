import { ChessColor } from "../../chess-game/ChessCommon"
import { IChessMoveFullData } from "../../chess-game/IChessMove"
import { IMatch } from "../../chess-game/IMatch"

export interface IGetMatchStateDTO {
  match: IMatch
  matchRecord: Array<IChessMoveFullData>
  matchRecordString: Array<string>
  viewedMoveNumber: number
  activeMatch: boolean
  myMatch: boolean
  myColor: ChessColor
  myTurn: boolean
  matchId: number
}