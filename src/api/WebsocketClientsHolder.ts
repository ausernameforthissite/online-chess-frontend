import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client"
import Endpoints from "./Endpoints"
import { WebsocketConnectionEnum } from "./websocketFunctions/WebsocketFunctions";

export class WebsocketClientsHolder {
  private static FindMatchClient: CompatClient | null;
  private static ChessMatchClient: CompatClient | null;

  public static getInstance(websocketConnectionType: WebsocketConnectionEnum): CompatClient {

    switch (websocketConnectionType) {
      case WebsocketConnectionEnum.FIND_MATCH:
        if (!WebsocketClientsHolder.FindMatchClient) {
            WebsocketClientsHolder.FindMatchClient = Stomp.over(() => {
              return new SockJS(Endpoints.RESOURCES.FIND_MATCH);
          }); 
          WebsocketClientsHolder.FindMatchClient.reconnectDelay = 5000;
          WebsocketClientsHolder.FindMatchClient.heartbeat.outgoing = 0;
          WebsocketClientsHolder.FindMatchClient.heartbeat.incoming = 10000;
        }
        return WebsocketClientsHolder.FindMatchClient as CompatClient;

      case WebsocketConnectionEnum.CHESS_MATCH:
        if (!WebsocketClientsHolder.ChessMatchClient) {
          WebsocketClientsHolder.ChessMatchClient = Stomp.over(() => {
            return new SockJS(Endpoints.RESOURCES.CHESS_MATCH);
          }); 
          WebsocketClientsHolder.ChessMatchClient.reconnectDelay = 5000;
        }
        return WebsocketClientsHolder.ChessMatchClient as CompatClient;
      
      default:
        throw new Error("Incorrect websocketConnectionType: " + websocketConnectionType);
    }
  }

  public static deactivate(websocketConnectionType: WebsocketConnectionEnum): void {
    switch (websocketConnectionType) {
      case WebsocketConnectionEnum.FIND_MATCH:
        if (WebsocketClientsHolder.FindMatchClient) {
          WebsocketClientsHolder.FindMatchClient.deactivate();
          WebsocketClientsHolder.FindMatchClient = null;
        }
        break;
      case WebsocketConnectionEnum.CHESS_MATCH:
        if (WebsocketClientsHolder.ChessMatchClient) {
          WebsocketClientsHolder.ChessMatchClient.deactivate();
          WebsocketClientsHolder.ChessMatchClient = null;
        }
        break;
      default:
        throw new Error("Incorrect websocketConnectionType: " + websocketConnectionType);
    }
  }
}