import { IWebsocketSendMessage } from "../../IWebsocketSendMessage";


export interface IFindMatchWebsocketRequest extends IWebsocketSendMessage {
  type: FindMatchWebsocketRequestEnum
}


export enum FindMatchWebsocketRequestEnum {
  CANCEL = "CANCEL",
}
