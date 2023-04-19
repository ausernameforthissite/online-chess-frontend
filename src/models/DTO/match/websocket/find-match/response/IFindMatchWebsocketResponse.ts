export interface IFindMatchWebsocketResponse {
  type: FindMatchWebsocketResponseEnum
}


export enum FindMatchWebsocketResponseEnum {
  OK = "OK",
  CANCELED = "CANCELED",
  GENERAL_BAD = "GENERAL_BAD",
  FIND_MATCH_BAD = "FIND_MATCH_BAD",
  CANCEL_BAD = "CANCEL_BAD"
}
