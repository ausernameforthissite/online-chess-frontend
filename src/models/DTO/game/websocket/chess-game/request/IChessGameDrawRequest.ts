import { ChessGameWebsocketRequestEnum, IChessGameWebsocketRequest } from "./IChessGameWebsocketRequest";

interface IChessGameDrawRequest extends IChessGameWebsocketRequest {
}

export const chessGameDrawRequest: IChessGameDrawRequest = {type: ChessGameWebsocketRequestEnum.DRAW} as IChessGameDrawRequest;

