import { IChessMove } from "../../../../../chess-game/IChessMove";
import { ChessMatchWebsocketRequestEnum, IChessMatchWebsocketRequest } from "./IChessMatchWebsocketRequest";

interface IChessMatchMoveRequest extends IChessMatchWebsocketRequest {
  chessMove: IChessMove
}

export function createChessMatchMoveRequest(chessMove: IChessMove): IChessMatchMoveRequest {
  return {type: ChessMatchWebsocketRequestEnum.CHESS_MOVE, chessMove: chessMove} as IChessMatchMoveRequest;
}