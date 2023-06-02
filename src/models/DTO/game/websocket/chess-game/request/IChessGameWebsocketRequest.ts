import { IWebsocketSendMessage } from "../../IWebsocketSendMessage";


export interface IChessGameWebsocketRequest extends IWebsocketSendMessage {
  type: ChessGameWebsocketRequestEnum
}


export enum ChessGameWebsocketRequestEnum {
  INFO = "INFO",
  CHESS_MOVE = "CHESS_MOVE",
  DRAW = "DRAW",
  ACCEPT_DRAW = "ACCEPT_DRAW",
  REJECT_DRAW = "REJECT_DRAW",
  SURRENDER = "SURRENDER",
}