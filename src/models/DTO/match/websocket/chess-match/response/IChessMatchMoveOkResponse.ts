import { IChessMoveFullData } from "../../../../../chess-game/IChessMove";
import { IChessMatchWebsocketResponse } from "./IChessMatchWebsocketResponse";


export interface IChessMatchMoveOkResponse extends IChessMatchWebsocketResponse {
  chessMove: IChessMoveFullData
}