import { closeEventCallbackType, CompatClient } from "@stomp/stompjs";
import { IWebsocketSendMessage } from "../../models/DTO/match/websocket/IWebsocketSendMessage";
import { getWebsocetSendEndpoint } from "../Endpoints";
import { WebsocketClientsHolder } from "../WebsocketClientsHolder";


export enum WebsocketConnectionEnum { FIND_MATCH, CHESS_MATCH }

interface IMyHeaders {
  "X-Authorization"?: string,
  "Match-Id"?: string
}

export async function connectToWebsocket(websocketConnectionType: WebsocketConnectionEnum, onConnectCb: Function, onWebSocketCloseCb: closeEventCallbackType, onErrorCb: Function, beforeConnectCb: () => Promise<void>, matchId?: string): Promise<void> {
  const client: CompatClient = WebsocketClientsHolder.getInstance(websocketConnectionType);

  if (client.active) {
    console.log("The client is already active + " + websocketConnectionType);
  }



  let headers: IMyHeaders = {};

  switch (websocketConnectionType) {
    case WebsocketConnectionEnum.FIND_MATCH:
      break;

    case WebsocketConnectionEnum.CHESS_MATCH:
      headers["Match-Id"] = matchId;
      break;
    default:
      throw new Error("Incorrect websocketConnectionType: " + websocketConnectionType);
  }


  client.onWebSocketClose = onWebSocketCloseCb;

  client.beforeConnect = beforeConnectCb;
  
  console.log("Connecting x2")
  client.connect(headers, onConnectCb, onErrorCb);

}


export const sendMessageToWebsocket = (websocketConnectionType: WebsocketConnectionEnum, message: IWebsocketSendMessage): void => {
  const client: CompatClient = WebsocketClientsHolder.getInstance(websocketConnectionType);

  if (!client.active) {
    throw new Error("The client is not active! " + websocketConnectionType);
  }

  client.send(getWebsocetSendEndpoint(websocketConnectionType), {}, JSON.stringify(message));
}

export async function deactivateWebsocketClient(websocketConnectionType: WebsocketConnectionEnum) {
    WebsocketClientsHolder.deactivate(websocketConnectionType);
}