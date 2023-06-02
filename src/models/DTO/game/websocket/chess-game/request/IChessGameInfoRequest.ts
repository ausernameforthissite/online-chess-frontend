import { ChessGameWebsocketRequestEnum, IChessGameWebsocketRequest } from "./IChessGameWebsocketRequest";

interface IChessGameInfoRequest extends IChessGameWebsocketRequest {
}

export const chessGameInfoRequest: IChessGameInfoRequest = {type: ChessGameWebsocketRequestEnum.INFO} as IChessGameInfoRequest;