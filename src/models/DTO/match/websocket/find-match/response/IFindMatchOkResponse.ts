import { IFindMatchWebsocketResponse } from "./IFindMatchWebsocketResponse";

export interface IFindMatchOkResponse extends IFindMatchWebsocketResponse {
  matchId: string
}