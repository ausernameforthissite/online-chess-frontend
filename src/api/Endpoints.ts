import { WebsocketConnectionEnum } from "./websocketFunctions/WebsocketFunctions"

const Endpoints = {

  AUTH: {
    REGISTER: 'http://localhost:8080/api/auth/register',
    LOGIN: 'http://localhost:8080/api/auth/login',
    REFRESH: 'http://localhost:8080/api/auth/refresh',
    LOGOUT: 'http://localhost:8080/api/auth/logout',
    ACCESS_COOKIE: 'http://localhost:8080/api/auth/access_token_cookie'
  },

  RESOURCES: {
    FIND_MATCH_BASE: 'http://localhost:8081/api/match/',
    FIND_MATCH: 'http://localhost:8081/ws',
    FIND_MATCH_SUBSCRIBE: '/user/queue/find_match/response',
    FIND_MATCH_SEND: '/ws/find_match/request',
    MATCH_BASE: 'http://localhost:8082/api/match/',
    CHESS_MATCH: 'http://localhost:8082/ws',
    CHESS_MATCH_SUBSCRIBE: '/user/queue/chess_match/response',
    CHESS_MATCH_SEND: '/ws/chess_match/request'
  }
}

export default Endpoints


export function getWebsocetSendEndpoint(websocketConnectionType: WebsocketConnectionEnum): string {
  switch (websocketConnectionType) {
    case WebsocketConnectionEnum.FIND_MATCH:
      return Endpoints.RESOURCES.FIND_MATCH_SEND;
    case WebsocketConnectionEnum.CHESS_MATCH:
      return Endpoints.RESOURCES.CHESS_MATCH_SEND;
    default:
      throw new Error("Incorrect websocket connection type: " + websocketConnectionType);
  }
}