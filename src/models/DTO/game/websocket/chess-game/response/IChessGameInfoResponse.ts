import { ICurrentUsersOnlineStatusesAndTimings } from "../../../../../chess-game/ICurrentUsersOnlineStatusesAndTimings"
import { IChessGameWebsocketResponse } from "./IChessGameWebsocketResponse"

export interface IChessGameInfoResponse extends IChessGameWebsocketResponse {
  lastMoveNumber: number
  currentUsersOnlineStatusesAndTimings: ICurrentUsersOnlineStatusesAndTimings
  initialTimeLeftMS: number
  initialFirstMoveTimeLeftMS: number
  initialReconnectTimeLeftMS: number
}