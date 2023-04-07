import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client"
import Endpoints from "./Endpoints"
import { WebsocketConnectionEnum } from "./websocketFunctions/WebsocketFunctions";

export class WebsocketClientsHolder {
  public static FindMatchClient: CompatClient;
  public static ChessMatchClient: CompatClient;

  public static getInstance(websocketConnectionType: WebsocketConnectionEnum, reconnect?: boolean): CompatClient {

    switch (websocketConnectionType) {
      case WebsocketConnectionEnum.FIND_MATCH:
        if (!WebsocketClientsHolder.FindMatchClient || reconnect) {
          WebsocketClientsHolder.FindMatchClient = Stomp.over(function(){
            return new SockJS(Endpoints.RESOURCES.FIND_MATCH);
         }); 
         WebsocketClientsHolder.FindMatchClient.reconnectDelay = 5000;
           WebsocketClientsHolder.FindMatchClient.heartbeat.outgoing = 0;
          WebsocketClientsHolder.FindMatchClient.heartbeat.incoming = 10000;
        }
        return this.FindMatchClient;

      case WebsocketConnectionEnum.CHESS_MATCH:
        if (!this.ChessMatchClient || reconnect) {
          const socket = new SockJS(Endpoints.RESOURCES.CHESS_MATCH);
          this.ChessMatchClient = Stomp.over(socket); 
        }
        return this.ChessMatchClient;
      
      default:
        throw new Error("Incorrect websocketConnectionType: " + websocketConnectionType);
    }
  }
}