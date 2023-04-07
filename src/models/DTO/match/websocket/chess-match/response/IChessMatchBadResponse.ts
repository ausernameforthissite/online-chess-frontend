import { IChessMatchWebsocketResponse } from "./IChessMatchWebsocketResponse";


export interface IChessMatchBadResponse extends IChessMatchWebsocketResponse {
  message: string
}