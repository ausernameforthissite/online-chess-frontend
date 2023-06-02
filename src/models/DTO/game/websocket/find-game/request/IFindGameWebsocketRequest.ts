import { IWebsocketSendMessage } from "../../IWebsocketSendMessage";


export interface IFindGameWebsocketRequest extends IWebsocketSendMessage {
  type: FindGameWebsocketRequestEnum
}


export enum FindGameWebsocketRequestEnum {
  CANCEL = "CANCEL",
}
