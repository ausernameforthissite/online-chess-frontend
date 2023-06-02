import { ChessGameWebsocketRequestEnum, IChessGameWebsocketRequest } from "./IChessGameWebsocketRequest";

interface IChessGameSurrenderRequest extends IChessGameWebsocketRequest {
}

export const chessGameSurrenderRequest: IChessGameSurrenderRequest = {type: ChessGameWebsocketRequestEnum.SURRENDER} as IChessGameSurrenderRequest;