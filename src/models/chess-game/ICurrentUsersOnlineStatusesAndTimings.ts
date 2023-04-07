export interface ICurrentUsersOnlineStatusesAndTimings {
  whiteUserOnline: boolean
  whiteTimeLeftMS: number
  whiteReconnectTimeLeftMS: number
  blackUserOnline: boolean
  blackTimeLeftMS: number
  blackReconnectTimeLeftMS: number
  userFirstMoveTimeLeftMS?: number
}