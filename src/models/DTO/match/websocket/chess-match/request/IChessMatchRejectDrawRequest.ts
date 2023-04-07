import { ChessMatchWebsocketRequestEnum, IChessMatchWebsocketRequest } from "./IChessMatchWebsocketRequest";

interface IChessMatchRejectDrawRequest extends IChessMatchWebsocketRequest {
}

export const chessMatchRejectDrawRequest: IChessMatchRejectDrawRequest = {type: ChessMatchWebsocketRequestEnum.REJECT_DRAW} as IChessMatchRejectDrawRequest;