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
    USER_IN_GAME_STATUS: 'http://localhost:8081/api/user',
    FIND_GAME_BASE: 'http://localhost:8081/api/game/',
    FIND_GAME: 'http://localhost:8081/ws',
    FIND_GAME_SUBSCRIBE: '/user/queue/find_game/response',
    FIND_GAME_SEND: '/ws/find_game/request',
    GAME_BASE: 'http://localhost:8082/api/game/',
    CHESS_GAME: 'http://localhost:8082/ws',
    CHESS_GAME_SUBSCRIBE: '/user/queue/chess_game/response',
    CHESS_GAME_SEND: '/ws/chess_game/request'
  }
}

export default Endpoints


export function getWebsocetSendEndpoint(websocketConnectionType: WebsocketConnectionEnum): string {
  switch (websocketConnectionType) {
    case WebsocketConnectionEnum.FIND_GAME:
      return Endpoints.RESOURCES.FIND_GAME_SEND;
    case WebsocketConnectionEnum.CHESS_GAME:
      return Endpoints.RESOURCES.CHESS_GAME_SEND;
    default:
      throw new Error("Incorrect websocket connection type: " + websocketConnectionType);
  }
}