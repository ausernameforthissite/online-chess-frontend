import { IFindGameWebsocketResponse } from "./IFindGameWebsocketResponse";


export interface IFindGameCancelBadResponse extends IFindGameWebsocketResponse {
  message: string
}