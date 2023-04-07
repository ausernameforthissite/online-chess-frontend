import { ChessColor } from "../../../../../chess-game/ChessCommon";
import { IChessMatchWebsocketResponse } from "./IChessMatchWebsocketResponse";

export interface IChessMatchUserDisconnectedResponse extends IChessMatchWebsocketResponse {
  disconnectedUserColor: ChessColor
}