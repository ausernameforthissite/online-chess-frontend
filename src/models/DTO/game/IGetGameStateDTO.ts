import { ChessColor } from "../../chess-game/ChessCommon"
import { IChessMoveFullData } from "../../chess-game/IChessMove"
import { IGame } from "../../chess-game/IGame"

export interface IGetGameStateDTO {
  game: IGame
  gameRecord: Array<IChessMoveFullData>
  gameRecordString: Array<string>
  viewedMoveNumber: number
  activeGame: boolean
  myGame: boolean
  myColor: ChessColor
  myTurn: boolean
  gameId: string
}