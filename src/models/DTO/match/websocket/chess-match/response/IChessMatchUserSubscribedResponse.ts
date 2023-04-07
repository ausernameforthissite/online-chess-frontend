import { ChessColor } from "../../../../../chess-game/ChessCommon";
import { IChessMatchWebsocketResponse } from "./IChessMatchWebsocketResponse";

export interface IChessMatchUserSubscribedResponse extends IChessMatchWebsocketResponse {
  subscribedUserColor: ChessColor
}