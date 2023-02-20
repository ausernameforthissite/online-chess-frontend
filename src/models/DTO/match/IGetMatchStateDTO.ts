import { ChessColor } from "../../chess-game/ChessCommon"
import { IChessMove, IChessMoveFullData } from "../../chess-game/IChessMove"
import { IMatch } from "../../chess-game/IMatch"

export interface IGetMatchStateDTO {
  match: IMatch
  matchRecord: Array<IChessMoveFullData>
  matchRecordString: Array<string>
  viewedMove: number
  activeMatch: boolean 
  myMatch: boolean
  myTurn: boolean
  myColor: ChessColor
  matchId: number
}