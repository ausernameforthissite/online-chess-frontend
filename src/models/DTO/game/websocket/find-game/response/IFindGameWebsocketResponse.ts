export interface IFindGameWebsocketResponse {
  type: FindGameWebsocketResponseEnum
}


export enum FindGameWebsocketResponseEnum {
  OK = "OK",
  CANCELED = "CANCELED",
  GENERAL_BAD = "GENERAL_BAD",
  FIND_GAME_BAD = "FIND_GAME_BAD",
  CANCEL_BAD = "CANCEL_BAD"
}
