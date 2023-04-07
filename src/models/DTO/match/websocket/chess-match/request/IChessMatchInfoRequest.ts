import { ChessMatchWebsocketRequestEnum, IChessMatchWebsocketRequest } from "./IChessMatchWebsocketRequest";

interface IChessMatchInfoRequest extends IChessMatchWebsocketRequest {
}

export const chessMatchInfoRequest: IChessMatchInfoRequest = {type: ChessMatchWebsocketRequestEnum.INFO} as IChessMatchInfoRequest;