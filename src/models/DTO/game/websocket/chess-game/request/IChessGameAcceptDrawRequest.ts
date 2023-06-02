import { ChessGameWebsocketRequestEnum, IChessGameWebsocketRequest } from "./IChessGameWebsocketRequest";

interface IChessGameAcceptDrawRequest extends IChessGameWebsocketRequest {
}

export const chessGameAcceptDrawRequest: IChessGameAcceptDrawRequest = {type: ChessGameWebsocketRequestEnum.ACCEPT_DRAW} as IChessGameAcceptDrawRequest;