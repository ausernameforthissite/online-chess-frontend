import { ChessGameWebsocketRequestEnum, IChessGameWebsocketRequest } from "./IChessGameWebsocketRequest";

interface IChessGameRejectDrawRequest extends IChessGameWebsocketRequest {
}

export const chessGameRejectDrawRequest: IChessGameRejectDrawRequest = {type: ChessGameWebsocketRequestEnum.REJECT_DRAW} as IChessGameRejectDrawRequest;