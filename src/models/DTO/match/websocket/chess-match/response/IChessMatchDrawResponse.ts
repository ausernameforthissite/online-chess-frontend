import { ChessColor } from "../../../../../chess-game/ChessCommon";
import { IChessMatchWebsocketResponse } from "./IChessMatchWebsocketResponse";

export interface IChessMatchDrawResponse extends IChessMatchWebsocketResponse {
  drawOfferUserColor: ChessColor;
}