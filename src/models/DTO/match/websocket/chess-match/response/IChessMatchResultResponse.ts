import { IChessMatchResult } from "../../../../../chess-game/IChessMatchResult";
import { IChessMatchWebsocketResponse } from "./IChessMatchWebsocketResponse";

export interface IChessMatchResultResponse extends IChessMatchWebsocketResponse {
  matchResult: IChessMatchResult
}