import { ChessMatchWebsocketRequestEnum, IChessMatchWebsocketRequest } from "./IChessMatchWebsocketRequest";

interface IChessMatchAcceptDrawRequest extends IChessMatchWebsocketRequest {
}

export const chessMatchAcceptDrawRequest: IChessMatchAcceptDrawRequest = {type: ChessMatchWebsocketRequestEnum.ACCEPT_DRAW} as IChessMatchAcceptDrawRequest;