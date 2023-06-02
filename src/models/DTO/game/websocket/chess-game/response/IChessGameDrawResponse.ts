import { ChessColor } from "../../../../../chess-game/ChessCommon";
import { IChessGameWebsocketResponse } from "./IChessGameWebsocketResponse";

export interface IChessGameDrawResponse extends IChessGameWebsocketResponse {
  drawOfferUserColor: ChessColor;
}