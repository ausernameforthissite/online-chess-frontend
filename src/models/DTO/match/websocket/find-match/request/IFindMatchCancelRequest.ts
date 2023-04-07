import { FindMatchWebsocketRequestEnum, IFindMatchWebsocketRequest } from "./IFindMatchWebsocketRequest";

interface IFindMatchCancelRequest extends IFindMatchWebsocketRequest {
}


export const findMatchCancelRequest: IFindMatchCancelRequest = {type: FindMatchWebsocketRequestEnum.CANCEL} as IFindMatchCancelRequest;
