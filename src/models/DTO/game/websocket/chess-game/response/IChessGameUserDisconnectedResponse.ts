import { ChessColor } from "../../../../../chess-game/ChessCommon";
import { IChessGameWebsocketResponse } from "./IChessGameWebsocketResponse";

export interface IChessGameUserDisconnectedResponse extends IChessGameWebsocketResponse {
  disconnectedUserColor: ChessColor
}