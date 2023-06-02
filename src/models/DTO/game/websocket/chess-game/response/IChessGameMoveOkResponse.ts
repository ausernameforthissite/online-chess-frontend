import { IChessMoveFullData } from "../../../../../chess-game/IChessMove";
import { IChessGameWebsocketResponse } from "./IChessGameWebsocketResponse";


export interface IChessGameMoveOkResponse extends IChessGameWebsocketResponse {
  chessMove: IChessMoveFullData
}