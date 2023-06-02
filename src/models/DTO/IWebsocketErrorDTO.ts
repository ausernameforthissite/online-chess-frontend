import { WebsocketErrorEnum } from "./game/websocket/WebsocketErrorEnum"

export interface IWebsocketErrorDTO {
  message: string
  code: WebsocketErrorEnum
}