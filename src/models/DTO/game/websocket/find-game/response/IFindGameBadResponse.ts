import { IFindGameWebsocketResponse } from "./IFindGameWebsocketResponse";


export interface IFindGameBadResponse extends IFindGameWebsocketResponse {
  message: string
}