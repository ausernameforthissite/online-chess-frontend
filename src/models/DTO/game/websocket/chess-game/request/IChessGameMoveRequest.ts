import { IChessMove } from "../../../../../chess-game/IChessMove";
import { ChessGameWebsocketRequestEnum, IChessGameWebsocketRequest } from "./IChessGameWebsocketRequest";

interface IChessGameMoveRequest extends IChessGameWebsocketRequest {
  chessMove: IChessMove
}

export function createChessGameMoveRequest(chessMove: IChessMove): IChessGameMoveRequest {
  return {type: ChessGameWebsocketRequestEnum.CHESS_MOVE, chessMove: chessMove} as IChessGameMoveRequest;
}