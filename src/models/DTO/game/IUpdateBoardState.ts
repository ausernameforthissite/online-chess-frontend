import { BoardState } from "../../chess-game/BoardState"

export interface IUpdateBoardState {
  boardState: BoardState
  pieceSelected: boolean
}