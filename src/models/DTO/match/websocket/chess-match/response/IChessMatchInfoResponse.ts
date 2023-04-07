import { ICurrentUsersOnlineStatusesAndTimings } from "../../../../../chess-game/ICurrentUsersOnlineStatusesAndTimings"
import { IChessMatchWebsocketResponse } from "./IChessMatchWebsocketResponse"

export interface IChessMatchInfoResponse extends IChessMatchWebsocketResponse {
  lastMoveNumber: number
  currentUsersOnlineStatusesAndTimings: ICurrentUsersOnlineStatusesAndTimings
  initialTimeLeftMS: number
  initialFirstMoveTimeLeftMS: number
  initialReconnectTimeLeftMS: number
}