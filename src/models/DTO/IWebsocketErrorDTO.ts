import { WebsocketErrorEnum } from "./match/websocket/WebsocketErrorEnum"

export interface IWebsocketErrorDTO {
  message: string
  code: WebsocketErrorEnum
}