export interface SubscribeResponse {
  type?: SubscribeResponseTypeEnum
}

export interface SubscribeOKResponse extends SubscribeResponse {
}


export enum SubscribeResponseTypeEnum {
  ok ="ok",
  chessMove = "chessMove"
}