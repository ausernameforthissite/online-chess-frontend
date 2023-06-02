import { IFindGameWebsocketResponse } from "./IFindGameWebsocketResponse";


export interface IFindGameOkResponse extends IFindGameWebsocketResponse {
  gameId: string
}