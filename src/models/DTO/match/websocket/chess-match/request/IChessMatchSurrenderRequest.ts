import { ChessMatchWebsocketRequestEnum, IChessMatchWebsocketRequest } from "./IChessMatchWebsocketRequest";

interface IChessMatchSurrenderRequest extends IChessMatchWebsocketRequest {
}

export const chessMatchSurrenderRequest: IChessMatchSurrenderRequest = {type: ChessMatchWebsocketRequestEnum.SURRENDER} as IChessMatchSurrenderRequest;