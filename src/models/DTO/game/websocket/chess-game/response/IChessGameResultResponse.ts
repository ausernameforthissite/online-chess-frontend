import { IChessGameResult } from "../../../../../chess-game/IChessGameResult";
import { IChessGameWebsocketResponse } from "./IChessGameWebsocketResponse";

export interface IChessGameResultResponse extends IChessGameWebsocketResponse {
  gameResult: IChessGameResult
}