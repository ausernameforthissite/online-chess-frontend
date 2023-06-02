import { ChessColor } from "../../../../../chess-game/ChessCommon";
import { IChessGameWebsocketResponse } from "./IChessGameWebsocketResponse";

export interface IChessGameUserSubscribedResponse extends IChessGameWebsocketResponse {
  subscribedUserColor: ChessColor
}