import { IFindMatchWebsocketResponse } from "./IFindMatchWebsocketResponse";

export interface IFindMatchBadResponse extends IFindMatchWebsocketResponse {
  message: string
}