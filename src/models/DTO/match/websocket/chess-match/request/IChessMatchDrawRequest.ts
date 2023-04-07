import { ChessMatchWebsocketRequestEnum, IChessMatchWebsocketRequest } from "./IChessMatchWebsocketRequest";

interface IChessMatchDrawRequest extends IChessMatchWebsocketRequest {
}

export const chessMatchDrawRequest: IChessMatchDrawRequest = {type: ChessMatchWebsocketRequestEnum.DRAW} as IChessMatchDrawRequest;

