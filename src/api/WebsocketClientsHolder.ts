import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client"
import Endpoints from "./Endpoints"
import { WebsocketConnectionEnum } from "./websocketFunctions/WebsocketFunctions";

export class WebsocketClientsHolder {
  private static FindGameClient: CompatClient | null;
  private static ChessGameClient: CompatClient | null;

  public static getInstance(websocketConnectionType: WebsocketConnectionEnum): CompatClient {

    switch (websocketConnectionType) {
      case WebsocketConnectionEnum.FIND_GAME:
        if (!WebsocketClientsHolder.FindGameClient) {
            WebsocketClientsHolder.FindGameClient = Stomp.over(() => {
              return new SockJS(Endpoints.RESOURCES.FIND_GAME);
          }); 
          WebsocketClientsHolder.FindGameClient.reconnectDelay = 5000;
          WebsocketClientsHolder.FindGameClient.heartbeat.outgoing = 0;
          WebsocketClientsHolder.FindGameClient.heartbeat.incoming = 10000;
        }
        return WebsocketClientsHolder.FindGameClient as CompatClient;

      case WebsocketConnectionEnum.CHESS_GAME:
        if (!WebsocketClientsHolder.ChessGameClient) {
          WebsocketClientsHolder.ChessGameClient = Stomp.over(() => {
            return new SockJS(Endpoints.RESOURCES.CHESS_GAME);
          }); 
          WebsocketClientsHolder.ChessGameClient.reconnectDelay = 5000;
        }
        return WebsocketClientsHolder.ChessGameClient as CompatClient;
      
      default:
        throw new Error("Incorrect websocketConnectionType: " + websocketConnectionType);
    }
  }

  public static deactivate(websocketConnectionType: WebsocketConnectionEnum): void {
    switch (websocketConnectionType) {
      case WebsocketConnectionEnum.FIND_GAME:
        if (WebsocketClientsHolder.FindGameClient) {
          WebsocketClientsHolder.FindGameClient.deactivate();
          WebsocketClientsHolder.FindGameClient = null;
        }
        break;
      case WebsocketConnectionEnum.CHESS_GAME:
        if (WebsocketClientsHolder.ChessGameClient) {
          WebsocketClientsHolder.ChessGameClient.deactivate();
          WebsocketClientsHolder.ChessGameClient = null;
        }
        break;
      default:
        throw new Error("Incorrect websocketConnectionType: " + websocketConnectionType);
    }
  }
}