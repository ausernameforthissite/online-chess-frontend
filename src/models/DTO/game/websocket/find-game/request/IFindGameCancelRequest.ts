import { FindGameWebsocketRequestEnum, IFindGameWebsocketRequest } from "./IFindGameWebsocketRequest";


interface IFindGameCancelRequest extends IFindGameWebsocketRequest {
}


export const findGameCancelRequest: IFindGameCancelRequest = {type: FindGameWebsocketRequestEnum.CANCEL} as IFindGameCancelRequest;
