import { IWebsocketSendMessage } from "../../IWebsocketSendMessage";


export interface IChessMatchWebsocketRequest extends IWebsocketSendMessage {
  type: ChessMatchWebsocketRequestEnum
}


export enum ChessMatchWebsocketRequestEnum {
  INFO = "INFO",
  CHESS_MOVE = "CHESS_MOVE",
  DRAW = "DRAW",
  ACCEPT_DRAW = "ACCEPT_DRAW",
  REJECT_DRAW = "REJECT_DRAW",
  SURRENDER = "SURRENDER",
}