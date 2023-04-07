export interface IChessMatchWebsocketResponse {
  type: ChessMatchWebsocketResponseEnum
}


export enum ChessMatchWebsocketResponseEnum {
  INFO = "INFO",
  CHESS_MOVE = "CHESS_MOVE",
  CHESS_MOVE_BAD = "CHESS_MOVE_BAD",
  DRAW = "DRAW",
  DRAW_BAD = "DRAW_BAD",
  REJECT_DRAW = "REJECT_DRAW",
  REJECT_DRAW_BAD = "REJECT_DRAW_BAD",
  ACCEPT_DRAW_BAD = "ACCEPT_DRAW_BAD",
  SURRENDER_BAD = "SURRENDER_BAD",
  SUBSCRIBED = "SUBSCRIBED",
  DISCONNECTED = "DISCONNECTED",
  MATCH_RESULT = "MATCH_RESULT"
}
