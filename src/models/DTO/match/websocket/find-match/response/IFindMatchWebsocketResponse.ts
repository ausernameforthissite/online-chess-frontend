export interface IFindMatchWebsocketResponse {
  type: FindMatchWebsocketResponseEnum
}


export enum FindMatchWebsocketResponseEnum {
  OK = "OK",
  BAD = "BAD",
  CANCELED = "CANCELED",
  CANCEL_FAILED = "CANCEL_FAILED"
}
