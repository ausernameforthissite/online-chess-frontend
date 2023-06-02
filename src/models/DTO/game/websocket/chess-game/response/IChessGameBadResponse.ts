import { IChessGameWebsocketResponse } from "./IChessGameWebsocketResponse";


export interface IChessGameBadResponse extends IChessGameWebsocketResponse {
  message: string
}