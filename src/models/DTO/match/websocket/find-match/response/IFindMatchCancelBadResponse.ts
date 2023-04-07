import { IFindMatchWebsocketResponse } from "./IFindMatchWebsocketResponse";

export interface IFindMatchCancelBadResponse extends IFindMatchWebsocketResponse {
  message: string
}