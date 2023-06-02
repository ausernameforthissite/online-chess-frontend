import _ from "lodash";
import { CompatClient, IMessage, StompHeaders } from "@stomp/stompjs";
import { getGameStateAxios, getUserInGameStatusAxios, getUsersRatingsDataAxios} from "../api/axiosFunctions/GameAxiosFunctions";
import Endpoints from "../api/Endpoints";
import { WebsocketClientsHolder } from "../api/WebsocketClientsHolder";
import { connectToWebsocket, deactivateWebsocketClient, sendMessageToWebsocket, WebsocketConnectionEnum } from "../api/websocketFunctions/WebsocketFunctions";
import { BoardState } from "../models/chess-game/BoardState";
import { ChessColor, getUserColorByMoveNumber, IChessCoords } from "../models/chess-game/ChessCommon";
import { chessMoveToString, IChessMove, IChessMoveFullData } from "../models/chess-game/IChessMove";
import { IGame } from "../models/chess-game/IGame";
import { getColorByUsername, isUserInGame } from "../models/chess-game/IUsersInGame";
import { ISelectChessPieceEnd, ISelectChessPieceStart } from "../models/DTO/game/ISelectChessPiece";
import { IChessGameResultResponse } from "../models/DTO/game/websocket/chess-game/response/IChessGameResultResponse";
import { IChessGameWebsocketResponse, ChessGameWebsocketResponseEnum } from "../models/DTO/game/websocket/chess-game/response/IChessGameWebsocketResponse";
import { IChessGameBadResponse } from "../models/DTO/game/websocket/chess-game/response/IChessGameBadResponse";
import { findGameCancelRequest } from "../models/DTO/game/websocket/find-game/request/IFindGameCancelRequest";
import { IFindGameBadResponse } from "../models/DTO/game/websocket/find-game/response/IFindGameBadResponse";
import { IFindGameCancelBadResponse } from "../models/DTO/game/websocket/find-game/response/IFindGameCancelBadResponse";
import { IFindGameOkResponse } from "../models/DTO/game/websocket/find-game/response/IFindGameOkResponse";
import { IFindGameWebsocketResponse, FindGameWebsocketResponseEnum } from "../models/DTO/game/websocket/find-game/response/IFindGameWebsocketResponse";
import { gameSlice, GameState } from "../store/reducers/GameReducer";
import { RootState, store } from "../store/store";
import { addLastMoveToBoardState, deleteLastMoveFromBoardState, deleteSelectionFromBoardState, makeChessMoveBackward, makeChessMoveForward } from "../utils/ChessGameUtils";
import { myHistory } from "../utils/History";
import { mapToGame } from "../utils/ModelMapper";
import { getAccessToken } from "./AuthService";
import { IChessGameMoveOkResponse } from "../models/DTO/game/websocket/chess-game/response/IChessGameMoveOkResponse";
import { IChessGameInfoResponse } from "../models/DTO/game/websocket/chess-game/response/IChessGameInfoResponse";
import { IChessGameUserSubscribedResponse } from "../models/DTO/game/websocket/chess-game/response/IChessGameUserSubscribedResponse";
import { IChessGameUserDisconnectedResponse } from "../models/DTO/game/websocket/chess-game/response/IChessGameUserDisconnectedResponse";
import { IGetGameStateDTO } from "../models/DTO/game/IGetGameStateDTO";
import { createChessGameMoveRequest } from "../models/DTO/game/websocket/chess-game/request/IChessGameMoveRequest";
import { chessGameDrawRequest } from "../models/DTO/game/websocket/chess-game/request/IChessGameDrawRequest";
import { chessGameSurrenderRequest } from "../models/DTO/game/websocket/chess-game/request/IChessGameSurrenderRequest";
import { chessGameAcceptDrawRequest } from "../models/DTO/game/websocket/chess-game/request/IChessGameAcceptDrawRequest";
import { IChessGameWebsocketRequest } from "../models/DTO/game/websocket/chess-game/request/IChessGameWebsocketRequest";
import { chessGameRejectDrawRequest } from "../models/DTO/game/websocket/chess-game/request/IChessGameRejectDrawRequest";
import { IChessGameDrawResponse } from "../models/DTO/game/websocket/chess-game/response/IChessGameDrawResponse";
import { chessGameInfoRequest } from "../models/DTO/game/websocket/chess-game/request/IChessGameInfoRequest";
import { IUserInGameStatusResponse, UserInGameStatusResponseEnum } from "../models/DTO/game/IUserInGameStatusResponse";
import { IUserInGameStatusTrueResponse } from "../models/DTO/game/IUserInGameStatusTrueResponse";
import { WebsocketErrorEnum } from "../models/DTO/game/websocket/WebsocketErrorEnum";
import { IWebsocketErrorDTO } from "../models/DTO/IWebsocketErrorDTO";
import axios, { AxiosError, AxiosResponse } from "axios";
import { ChessGameTypesType } from "../models/chess-game/ChessGameType";



let chessGameSubscribeTimeout: ReturnType<typeof setTimeout> | null;


export async function getUserInGameStatus(): Promise<void> {
  try {
    const res = await getUserInGameStatusAxios();
    const userInGameStatus: IUserInGameStatusResponse = res.data;
    console.log(userInGameStatus.type)
    if (userInGameStatus.type === UserInGameStatusResponseEnum.TRUE) {
      store.dispatch(gameSlice.actions.searchAlreadyInGame((userInGameStatus as IUserInGameStatusTrueResponse).gameId));
    } else if (userInGameStatus.type !== UserInGameStatusResponseEnum.FALSE) {
      throw new Error("Incorrect UserInGameStatusResponse type");
    }
  } catch (e: any) {
    throw new Error(e.message);
  } finally {
    store.dispatch(gameSlice.actions.setSearchPageLoaded(true));
  }
}

export function findGame(chessGameType: ChessGameTypesType) : void {
  store.dispatch(gameSlice.actions.searchStart(chessGameType))
  connectToWebsocket(WebsocketConnectionEnum.FIND_GAME, onConnectedToFindGame, onFindGameWebsocketClose, onFindGameError, findGameBeforeConnect);
}

function onConnectedToFindGame(): void  {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_GAME);
  client.subscribe(Endpoints.RESOURCES.FIND_GAME_SUBSCRIBE, onFindGameMessageReceived);
  store.dispatch(gameSlice.actions.searchStartSuccess())
}

function onFindGameWebsocketClose(evt: CloseEvent): void {
  console.log(evt.code);
  const gameData: GameState = store.getState().gameData;
  if (![1000, 1001, 1002, 1006, 1010, 1011, 1012, 1013, 1014, 1015].includes(evt.code)) {
    deactivateWebsocketClient(WebsocketConnectionEnum.FIND_GAME);

    if (gameData.searchStart || gameData.searching) {
      console.error("Connection closed by the server.");
      store.dispatch(gameSlice.actions.searchFailure());
    }
  }

  if (gameData.searchConnectionAttemptsCount > 3) {
    deactivateWebsocketClient(WebsocketConnectionEnum.FIND_GAME);
    store.dispatch(gameSlice.actions.searchFailure({message: "Проблемы с подключением к серверу.", code: WebsocketErrorEnum.CLOSE_CONNECTION_GENERAL} as IWebsocketErrorDTO));
  }
}

function onFindGameError(message: IMessage): void  {
  const headers: StompHeaders = message.headers;
  const errorCode: WebsocketErrorEnum = headers["ErrorCode"] as unknown as WebsocketErrorEnum;


  if (errorCode) {
    switch(errorCode) {
      case WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_IN_GAME:
      case WebsocketErrorEnum.CLOSE_CONNECTION_GENERAL:
        deactivateWebsocketClient(WebsocketConnectionEnum.FIND_GAME);
        store.dispatch(gameSlice.actions.searchFailure({message: message.body, code: errorCode} as IWebsocketErrorDTO));
        console.error("Error code: " + errorCode + ". Error message: " + message.body);
        return;
    }
    console.error("Error code: " + errorCode + ". Error message: " + message.body);
  } else {
    console.error(message.body);
  }

}

async function findGameBeforeConnect(): Promise<void> {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_GAME);
  const clientConnectHeaders: StompHeaders = client.connectHeaders;
  const accessToken: string | null = await getAccessToken();
  const searchGameType: ChessGameTypesType | null = store.getState().gameData.gameType;

  let errorMessage: string;

  if (accessToken) {
    clientConnectHeaders["X-Authorization"] = "Bearer " + accessToken;

    if (searchGameType) {
      clientConnectHeaders["GameType"] = searchGameType;
      store.dispatch(gameSlice.actions.searchIncrementConnectionCount());
      return;
    } else {
      errorMessage = "No chessGameType was found.";
    }
  } else {
    errorMessage = "You are not logged in.";
  }

  client.deactivate();
  store.dispatch(gameSlice.actions.searchFailure());
  console.error(errorMessage);
}

function onFindGameMessageReceived(message: IMessage): void {
  const response: IFindGameWebsocketResponse = JSON.parse(message.body)
  let client: CompatClient;
  
  switch(response.type) {
    case FindGameWebsocketResponseEnum.OK:
      deactivateWebsocketClient(WebsocketConnectionEnum.FIND_GAME);
      const okResp: IFindGameOkResponse = (response as IFindGameOkResponse);
      store.dispatch(gameSlice.actions.searchSuccess(okResp));
      myHistory.push(`/game/${okResp.gameId}`)
      return;
    case FindGameWebsocketResponseEnum.FIND_GAME_BAD:
      deactivateWebsocketClient(WebsocketConnectionEnum.FIND_GAME);
      store.dispatch(gameSlice.actions.searchFailure({message: (response as IFindGameBadResponse).message, code: WebsocketErrorEnum.CLOSE_CONNECTION_GENERAL} as IWebsocketErrorDTO));
      return;
    case FindGameWebsocketResponseEnum.CANCELED:
      deactivateWebsocketClient(WebsocketConnectionEnum.FIND_GAME);
      store.dispatch(gameSlice.actions.searchCanceled());
      return;
    case FindGameWebsocketResponseEnum.CANCEL_BAD:
      store.dispatch(gameSlice.actions.searchCancelFailure((response as IFindGameCancelBadResponse).message));
      return;
    case FindGameWebsocketResponseEnum.GENERAL_BAD:
      console.error((response as IFindGameBadResponse).message);
      break;
    default:
      console.error("Response of unknown type:  ");
      console.error(response);
    }
    store.dispatch(gameSlice.actions.failCurrentFindGameActions());
}

export function cancelFindGame(): void {
  try {
    store.dispatch(gameSlice.actions.searchCancelStart);
    const state: RootState = store.getState();

    if (state.gameData.searching && !state.gameData.searchCanceling) {
      sendMessageToWebsocket(WebsocketConnectionEnum.FIND_GAME, findGameCancelRequest)
    } else {
      throw new Error("Can't cancel game search...");
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(gameSlice.actions.searchCancelFailure(e.message))
  }
}


export async function getGameState(gameId: string): Promise<void> {
  try {
    const res = await getGameStateAxios(gameId);
    const game = mapToGame(res.data);
    const activeGame: boolean = !res.data.finished;
    const gameRecord = res.data.gameRecord; 
    const gameRecordString: Array<string> = [];
    const viewedMove = res.data.gameRecord.length - 1;

    for (let i: number = 0; i < gameRecord.length; i++) {
      gameRecordString.push(chessMoveToString(gameRecord[i]));
    }

    const state: RootState = store.getState();

    let myGame: boolean = false;
    let myColor: ChessColor = ChessColor.white;
    let myTurn: boolean = false;

    let enPassantPawnCoords: IChessCoords | null = null;
      
    for (let i = 0; i < res.data.gameRecord.length; i++) {
      enPassantPawnCoords = makeChessMoveForward(game.boardState,  gameRecord[i])
    }

    if (viewedMove >= 0) {
      addLastMoveToBoardState(game.boardState, gameRecord[viewedMove].startCoords, gameRecord[viewedMove].endCoords)
    }

    game.enPassantPawnCoords = enPassantPawnCoords;

    
    if (state.authData.loggedIn && state.authData.username) {

      const username: string = state.authData.username;

      if (isUserInGame(res.data.usersInGame, username)) {
        myGame = true;
        myColor = getColorByUsername(res.data.usersInGame, username);
        myTurn = activeGame && myColor === getUserColorByMoveNumber(gameRecord.length);
      }
    }

    store.dispatch(gameSlice.actions.getGameStateSuccess({
      game: game,
      gameRecord: gameRecord,
      gameRecordString: gameRecordString,
      viewedMoveNumber: viewedMove,
      activeGame: activeGame,
      myGame: myGame,
      myColor: myColor,
      myTurn: myTurn,
      gameId: gameId
    } as IGetGameStateDTO));

    if (!activeGame) {
      store.dispatch(gameSlice.actions.loadGameSuccess())
    }
  } catch (e: any) {
    console.error(e);
    if (axios.isAxiosError(e)) {
      const axiosError: AxiosError = e as AxiosError;

      if (axiosError.response?.status === 404) {
        myHistory.push("/error");
      }
    }

    store.dispatch(gameSlice.actions.getGameStateFailure(e.message))
  }
}

export async function getGameStateAndSubscribeToGame(gameId: string): Promise<void> {
  await getGameState(gameId);
  const gameData: GameState = store.getState().gameData;

  if (gameData.subscribed) {
    sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_GAME, chessGameInfoRequest);
  } else if (!gameData.subscribing && gameId === gameData.gameId && gameData.activeGame) {
    subscribeToChessGame();
  }
}

export async function getUsersRatingsData(gameId: string): Promise<void> {
  try {
    const res = await getUsersRatingsDataAxios(gameId);
    store.dispatch(gameSlice.actions.getUsersRatingsDataSuccess(res.data));
  } catch (e: any) {
    console.error(e)
  }
}

export function subscribeToChessGame(): void {
  const state: RootState = store.getState();

  if (state.gameData.gameId && !state.gameData.subscribing && !state.gameData.subscribed) {
    store.dispatch(gameSlice.actions.subscribingStart());
    connectToWebsocket(WebsocketConnectionEnum.CHESS_GAME, onConnectedToChessGame, onChessGameWebsocketClose, onChessGameError, chessGameBeforeConnect, state.gameData.gameId);
  } else {
    const errorMessage: string = "Can't subscribe to game - there is no gameId in the store";
    store.dispatch(gameSlice.actions.subscribeFailure());
    throw new Error(errorMessage);
  }
}

function doSetTimeout(): void {
  doClearTimeout();

  chessGameSubscribeTimeout = setTimeout(() => {
    const gameData: GameState = store.getState().gameData;

    if (gameData.subscribeConnectionAttemptsCount <= 4) {
      if (!gameData.subscribing && !gameData.subscribed) {
        subscribeToChessGame();
      } else {
        store.dispatch(gameSlice.actions.subscribeIncrementConnectionCount());
        doSetTimeout();
        sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_GAME, chessGameInfoRequest);
      }
    } else {
      deactivateWebsocketClient(WebsocketConnectionEnum.CHESS_GAME);
    }
  }, 2000);
}

 function doClearTimeout(): void {
  if (chessGameSubscribeTimeout !== null) {
    clearTimeout(chessGameSubscribeTimeout);
    chessGameSubscribeTimeout = null;
  }
 }

function onConnectedToChessGame(): void  {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_GAME);
  client.subscribe(Endpoints.RESOURCES.CHESS_GAME_SUBSCRIBE, onChessGameMessageReceived);
  doSetTimeout();
  store.dispatch(gameSlice.actions.subscribeSuccess());
  sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_GAME, chessGameInfoRequest);
};

function onChessGameWebsocketClose(evt: CloseEvent): void {
  console.log("Close event code: " + evt.code);
  if (![1000, 1001, 1002, 1006, 1010, 1011, 1012, 1013, 1014, 1015].includes(evt.code)) {
    deactivateWebsocketClient(WebsocketConnectionEnum.CHESS_GAME);

    console.error("Connection closed by the server.");
  }

  const gameData: GameState = store.getState().gameData;

  if (gameData.subscribeConnectionAttemptsCount > 4) {
    deactivateWebsocketClient(WebsocketConnectionEnum.CHESS_GAME);
    store.dispatch(gameSlice.actions.subscribeFailure({message: "Проблемы с подключением к серверу.", code: WebsocketErrorEnum.RETRY_GENERAL} as IWebsocketErrorDTO));
  } else if (gameData.subscribing || gameData.subscribed) {
    store.dispatch(gameSlice.actions.subscribeFailure());
  }
};

function onChessGameError(message: IMessage): void  {
  const headers: StompHeaders = message.headers;
  const errorCode: WebsocketErrorEnum = headers["ErrorCode"] as unknown as WebsocketErrorEnum;

  if (errorCode) {
    switch(errorCode) {
      case WebsocketErrorEnum.CLOSE_CONNECTION_GENERAL:
      case WebsocketErrorEnum.CLOSE_CONNECTION_NO_ACTIVE_GAME:
      case WebsocketErrorEnum.CLOSE_CONNECTION_ALREADY_SUBSCRIBED:
        doClearTimeout();
        deactivateWebsocketClient(WebsocketConnectionEnum.CHESS_GAME);
        store.dispatch(gameSlice.actions.subscribeFailure({message: message.body, code: errorCode} as IWebsocketErrorDTO));
        console.error("Error code: " + errorCode + ". Error message: " + message.body);
        return;
    }
    console.error("Error code: " + errorCode + ". Error message: " + message.body);
  } else {
    console.error(message.body);
  }
};

async function chessGameBeforeConnect(): Promise<void> {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_GAME);
  const clientConnectHeaders: StompHeaders = client.connectHeaders;

  store.dispatch(gameSlice.actions.subscribeIncrementConnectionCount());

  const state: RootState = store.getState();

  if (state.authData.loggedIn) {
    const accessToken: string | null = await getAccessToken();

    if (accessToken) {
      clientConnectHeaders["X-Authorization"] = "Bearer " + accessToken;
    }
  }
}



function onChessGameMessageReceived(message: IMessage): void {
  const response: IChessGameWebsocketResponse = JSON.parse(message.body);
  let gameData: GameState;

  switch(response.type) {
    case ChessGameWebsocketResponseEnum.INFO:
      doClearTimeout();
      store.dispatch(gameSlice.actions.updateUsersInfo(response as IChessGameInfoResponse));
      return;
    case ChessGameWebsocketResponseEnum.SUBSCRIBED:
      store.dispatch(gameSlice.actions.updateOnUserSubscribed((response as IChessGameUserSubscribedResponse).subscribedUserColor));
      return;
    case ChessGameWebsocketResponseEnum.DISCONNECTED:
      store.dispatch(gameSlice.actions.updateOnUserDisconnected(response as IChessGameUserDisconnectedResponse));
      return;
    case ChessGameWebsocketResponseEnum.CHESS_MOVE:
      makeChessMove((response as IChessGameMoveOkResponse).chessMove);
      return;
    case ChessGameWebsocketResponseEnum.CHESS_MOVE_BAD:
      console.error((response as IChessGameBadResponse).message);
      store.dispatch(gameSlice.actions.sendChessMoveFailure());
      return;
    case ChessGameWebsocketResponseEnum.DRAW:
      store.dispatch(gameSlice.actions.receiveDrawOffer((response as IChessGameDrawResponse).drawOfferUserColor));
      return;
    case ChessGameWebsocketResponseEnum.DRAW_BAD:
      console.error((response as IChessGameBadResponse).message);
      store.dispatch(gameSlice.actions.offerDrawFailure());
      return;
    case ChessGameWebsocketResponseEnum.REJECT_DRAW:
      store.dispatch(gameSlice.actions.offerDrawRejected());
      return;
    case ChessGameWebsocketResponseEnum.REJECT_DRAW_BAD:
    case ChessGameWebsocketResponseEnum.ACCEPT_DRAW_BAD:
      console.error((response as IChessGameBadResponse).message);
      store.dispatch(gameSlice.actions.handleIncomingDrawOfferFinish());
      return;
    case ChessGameWebsocketResponseEnum.SURRENDER_BAD:
      console.error((response as IChessGameBadResponse).message);
      store.dispatch(gameSlice.actions.surrenderFailure());
      return;
    case ChessGameWebsocketResponseEnum.GAME_RESULT:
      deactivateWebsocketClient(WebsocketConnectionEnum.CHESS_GAME);
      store.dispatch(gameSlice.actions.finishChessGame((response as IChessGameResultResponse).gameResult));
      gameData = store.getState().gameData;
      if (gameData.viewedMoveNumber === gameData.lastMoveNumber) {
        store.dispatch(gameSlice.actions.clearBoardState());
      }
      if (gameData.gameId) {
        getUsersRatingsData(gameData.gameId);
      } else {
        throw new Error("There is no game id!");
      }
      return;
    case ChessGameWebsocketResponseEnum.GENERAL_BAD:
      console.error((response as IChessGameBadResponse).message);
      break;
    default:
      console.error("Response of unknown type:  ");
      console.error(response);
  }

  gameData = store.getState().gameData;
  if (gameData.viewedMoveNumber === gameData.lastMoveNumber) {
    store.dispatch(gameSlice.actions.clearBoardState());
  }
  store.dispatch(gameSlice.actions.failCurrentChessGameActions());
}


export function sendChessMove(chessMoveEnd: ISelectChessPieceEnd) : void {
  try {
    const state: RootState = store.getState();
    const gameId: string | null = state.gameData.gameId;
    const newMoveStart: ISelectChessPieceStart | null = state.gameData.newMoveStart;
    const subscribed: boolean = state.gameData.subscribed;
    const sendingMoveNumber: number = state.gameData.lastMoveNumber + 1;

    if (gameId && newMoveStart && subscribed) {
      const chessMoveToSend: IChessMove = { moveNumber: sendingMoveNumber, startPiece: newMoveStart.startPiece, startCoords: newMoveStart.startCoords,
                                            endPiece: chessMoveEnd.endPiece, endCoords: chessMoveEnd.endCoords,
                                            castling: chessMoveEnd.castling, pawnPromotionPiece: chessMoveEnd.pawnPromotionPiece};
      if (!store.getState().gameData.sendingChessMove) {
        store.dispatch(gameSlice.actions.sendChessMoveStart());
        sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_GAME, createChessGameMoveRequest(chessMoveToSend))
      }
      
    } else {
      throw new Error("gameId or newMoveStart is not found. Or you are not subscribed to the game")
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(gameSlice.actions.sendChessMoveFailure())
    }
}

export function selectCertainChessMove(chessMoveNumber: number): void {
  const state: RootState = store.getState();
  const game: IGame | null = state.gameData.game;
  const gameRecord: Array<IChessMoveFullData> | null = state.gameData.gameRecord;

  if (game && gameRecord) {
    if (chessMoveNumber < gameRecord.length && chessMoveNumber >= 0) {
      let direction: number = Math.sign(chessMoveNumber - state.gameData.viewedMoveNumber);
      let makeChessMoveFunction: (boardState: BoardState, chessMove: IChessMoveFullData) => (IChessCoords | null);

      if (direction === 0) {
        return;
      } else if (direction > 0) {
        makeChessMoveFunction = makeChessMoveForward;
      } else {
        makeChessMoveFunction = makeChessMoveBackward;
      }

      const newBoardState = _.cloneDeep(game.boardState);
      deleteSelectionFromBoardState(newBoardState);
      deleteLastMoveFromBoardState(newBoardState, gameRecord[state.gameData.viewedMoveNumber].startCoords, gameRecord[state.gameData.viewedMoveNumber].endCoords);
      
      let enPassantPawnCoords: IChessCoords | null = game.enPassantPawnCoords;
      

      for (let i = state.gameData.viewedMoveNumber; i !== chessMoveNumber; i += direction) {
        enPassantPawnCoords = makeChessMoveFunction(newBoardState,  gameRecord[direction > 0 ? i + direction : i])
      }

      addLastMoveToBoardState(newBoardState, gameRecord[chessMoveNumber].startCoords, gameRecord[chessMoveNumber].endCoords)

      store.dispatch(gameSlice.actions.viewCertainChessMove({boardState: newBoardState, moveNumber: chessMoveNumber, enPassantPawnCoords: enPassantPawnCoords}))

    } else {
      throw new Error("Wrong chess move number")
    }
  } else {
    throw new Error("Game or game record is not found")
  }
}

function makeChessMove(chessMove: IChessMoveFullData): void {
  const state: RootState = store.getState();
  const game: IGame | null = state.gameData.game;
  const gameRecord: Array<IChessMoveFullData> | null = state.gameData.gameRecord;

  if (game && gameRecord) {
    if ((state.gameData.lastMoveNumber + 1) !== chessMove.moveNumber) {
      if (state.gameData.gameId) {
        getGameStateAndSubscribeToGame(state.gameData.gameId);
        return;
      } else {
        throw new Error("There is no game id!");
      }
    }

    if (state.gameData.viewedMoveNumber === state.gameData.lastMoveNumber) {

      const newBoardState: BoardState = _.cloneDeep(game.boardState);
      deleteSelectionFromBoardState(newBoardState);

      if (state.gameData.lastMoveNumber >= 0) {
        deleteLastMoveFromBoardState(newBoardState, gameRecord[state.gameData.lastMoveNumber].startCoords, gameRecord[state.gameData.lastMoveNumber].endCoords)
      }

      const enPassantPawnCoords: IChessCoords | null = makeChessMoveForward(newBoardState, chessMove);
      addLastMoveToBoardState(newBoardState, chessMove.startCoords, chessMove.endCoords)
      store.dispatch(gameSlice.actions.makeChessMove({chessMove: chessMove, boardState: newBoardState, enPassantPawnCoords: enPassantPawnCoords}));

    } else {

      store.dispatch(gameSlice.actions.makeChessMove({chessMove: chessMove}));

    }
    
  } else {
    throw new Error("No game or gameRecord was found")
  }

}

export function offerDraw() : void {
  try {
    const gameData: GameState = store.getState().gameData;

    if (!gameData.offeringDraw && !gameData.drawOfferReceived && !gameData.surrendering) {
        store.dispatch(gameSlice.actions.offerDrawStart());
        sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_GAME, chessGameDrawRequest);
        store.dispatch(gameSlice.actions.offerDrawSuccess());
    } else {
      throw new Error("Already offering draw or received draw or surrendering.")
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(gameSlice.actions.offerDrawFailure())
    }
}

export function surrender() : void {
  try {
    const gameData: GameState = store.getState().gameData;

    if (!gameData.surrendering) {
        store.dispatch(gameSlice.actions.surrenderStart());
        sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_GAME, chessGameSurrenderRequest);
    } else {
      throw new Error("Already surrendering.")
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(gameSlice.actions.surrenderFailure())
    }
}

export function handleDrawOffer(accept: boolean) : void {
  try {
    store.dispatch(gameSlice.actions.handleIncomingDrawOfferStart());
    const request: IChessGameWebsocketRequest = accept ? chessGameAcceptDrawRequest: chessGameRejectDrawRequest;
    sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_GAME, request);
    store.dispatch(gameSlice.actions.handleIncomingDrawOfferFinish());
  } catch (e: any) {
      console.error(e)
      store.dispatch(gameSlice.actions.handleIncomingDrawOfferFailure());
  }
}

export function closeConnectionAndClearGameState() {
  deactivateWebsocketClient(WebsocketConnectionEnum.CHESS_GAME);
  store.dispatch(gameSlice.actions.clearGameState());
}