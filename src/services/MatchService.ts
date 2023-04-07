import _ from "lodash";
import { CompatClient, IMessage, StompHeaders } from "@stomp/stompjs";
import { getMatchStateAxios, getUsersRatingsDataAxios} from "../api/axiosFunctions/MatchAxiosFunctions";
import Endpoints from "../api/Endpoints";
import { WebsocketClientsHolder } from "../api/WebsocketClientsHolder";
import { connectToWebsocket, sendMessageToWebsocket, WebsocketConnectionEnum } from "../api/websocketFunctions/WebsocketFunctions";
import { BoardState } from "../models/chess-game/BoardState";
import { ChessColor, getUserColorByMoveNumber, IChessCoords } from "../models/chess-game/ChessCommon";
import { chessMoveToString, IChessMove, IChessMoveFullData } from "../models/chess-game/IChessMove";
import { IMatch } from "../models/chess-game/IMatch";
import { getColorByUsername, isUserInMatch } from "../models/chess-game/IUsersInMatch";
import { ISelectChessPieceEnd, ISelectChessPieceStart } from "../models/DTO/match/ISelectChessPiece";
import { IChessMatchResultResponse } from "../models/DTO/match/websocket/chess-match/response/IChessMatchResultResponse";
import { IChessMatchWebsocketResponse, ChessMatchWebsocketResponseEnum } from "../models/DTO/match/websocket/chess-match/response/IChessMatchWebsocketResponse";
import { IChessMatchBadResponse } from "../models/DTO/match/websocket/chess-match/response/IChessMatchBadResponse";
import { findMatchCancelRequest } from "../models/DTO/match/websocket/find-match/request/IFindMatchCancelRequest";
import { IFindMatchBadResponse } from "../models/DTO/match/websocket/find-match/response/IFindMatchBadResponse";
import { IFindMatchCancelBadResponse } from "../models/DTO/match/websocket/find-match/response/IFindMatchCancelBadResponse";
import { IFindMatchOkResponse } from "../models/DTO/match/websocket/find-match/response/IFindMatchOkResponse";
import { IFindMatchWebsocketResponse, FindMatchWebsocketResponseEnum } from "../models/DTO/match/websocket/find-match/response/IFindMatchWebsocketResponse";
import { matchSlice, MatchState } from "../store/reducers/MatchReducer";
import { RootState, store } from "../store/store";
import { deleteSelectionFromBoardState, makeChessMoveBackward, makeChessMoveForward } from "../utils/ChessGameUtils";
import { myHistory } from "../utils/History";
import { mapToMatch } from "../utils/ModelMapper";
import { getAccessToken } from "./AuthService";
import { IChessMatchMoveOkResponse } from "../models/DTO/match/websocket/chess-match/response/IChessMatchMoveOkResponse";
import { IChessMatchInfoResponse } from "../models/DTO/match/websocket/chess-match/response/IChessMatchInfoResponse";
import { IChessMatchUserSubscribedResponse } from "../models/DTO/match/websocket/chess-match/response/IChessMatchUserSubscribedResponse";
import { IChessMatchUserDisconnectedResponse } from "../models/DTO/match/websocket/chess-match/response/IChessMatchUserDisconnectedResponse";
import { IGetMatchStateDTO } from "../models/DTO/match/IGetMatchStateDTO";
import { createChessMatchMoveRequest } from "../models/DTO/match/websocket/chess-match/request/IChessMatchMoveRequest";
import { chessMatchDrawRequest } from "../models/DTO/match/websocket/chess-match/request/IChessMatchDrawRequest";
import { chessMatchSurrenderRequest } from "../models/DTO/match/websocket/chess-match/request/IChessMatchSurrenderRequest";
import { chessMatchAcceptDrawRequest } from "../models/DTO/match/websocket/chess-match/request/IChessMatchAcceptDrawRequest";
import { IChessMatchWebsocketRequest } from "../models/DTO/match/websocket/chess-match/request/IChessMatchWebsocketRequest";
import { chessMatchRejectDrawRequest } from "../models/DTO/match/websocket/chess-match/request/IChessMatchRejectDrawRequest";
import { IChessMatchDrawResponse } from "../models/DTO/match/websocket/chess-match/response/IChessMatchDrawResponse";
import { chessMatchInfoRequest } from "../models/DTO/match/websocket/chess-match/request/IChessMatchInfoRequest";



export function findMatch() : void {
  store.dispatch(matchSlice.actions.searchStart())
  const state: RootState = store.getState();

  if (state.matchData.activeMatch && state.matchData.myMatch) {
    store.dispatch(matchSlice.actions.searchFailure("You are already in match with id = " + state.matchData.matchId))
  } else {
    connectToWebsocket(WebsocketConnectionEnum.FIND_MATCH, onConnectedToFindMatch, onFindMatchWebsocketClose, onFindMatchError, findMatchBeforeConnect);
  }
}

function onConnectedToFindMatch(): void  {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);
  client.subscribe(Endpoints.RESOURCES.FIND_MATCH_SUBSCRIBE, onFindMatchMessageReceived);
  store.dispatch(matchSlice.actions.searchStartSuccess())
}

function onFindMatchWebsocketClose(evt: CloseEvent): void {
  if (![1002, 1006, 1010, 1011, 1012, 1013, 1014, 1015].includes(evt.code)) {
    const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);
    client.deactivate();
    const state: RootState = store.getState();

    if (state.matchData.searchStart || state.matchData.searching) {
      store.dispatch(matchSlice.actions.searchFailure("Connection closed by server"));
    }
  }
}

function onFindMatchError(message: IMessage): void  {
  const headers: StompHeaders = message.headers;
  const customError: string = headers["Close-Connection"];

  if (customError === "true") {
    const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);
    client.deactivate();
    store.dispatch(matchSlice.actions.searchFailure(message.body));

    const splittedMessage: Array<string> = message.body.split("id=");

    if (splittedMessage.length === 2) {
      store.dispatch(matchSlice.actions.searchAlreadyInMatch(Number(splittedMessage[1])));
    }
  }

  console.error(message.body);
}

async function findMatchBeforeConnect(): Promise<void> {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);
  const clientConnectHeaders: StompHeaders = client.connectHeaders;
  const accessToken: string | null = await getAccessToken();

  if (accessToken) {
    clientConnectHeaders["X-Authorization"] = "Bearer " + accessToken;
  } else {
    client.deactivate();
    store.dispatch(matchSlice.actions.searchFailure("You are not logged in!"))
  }
}

function onFindMatchMessageReceived(message: IMessage): void {
  const response: IFindMatchWebsocketResponse = JSON.parse(message.body)
  let client: CompatClient;
  
  switch(response.type) {
    case FindMatchWebsocketResponseEnum.OK:
      client = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);
      client.deactivate();
      const okResp: IFindMatchOkResponse = (response as IFindMatchOkResponse);
      store.dispatch(matchSlice.actions.searchSuccess(okResp));
      myHistory.push(`/match/${okResp.matchId}`)
      break;
    case FindMatchWebsocketResponseEnum.BAD:
      client = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);
      client.deactivate();
      store.dispatch(matchSlice.actions.searchFailure((response as IFindMatchBadResponse).message));
      break;
    case FindMatchWebsocketResponseEnum.CANCELED:
      client = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.FIND_MATCH);
      client.deactivate();
      store.dispatch(matchSlice.actions.searchCanceled());
      break;
    case FindMatchWebsocketResponseEnum.CANCEL_FAILED:
      store.dispatch(matchSlice.actions.searchCancelFailure((response as IFindMatchCancelBadResponse).message));
      break;
    default:
      console.log("Response of unknown type:  ");
      console.log(response)
      break;
  }
}

export function cancelFindMatch(): void {
  try {
    store.dispatch(matchSlice.actions.searchCancelStart);
    const state: RootState = store.getState();

    if (state.matchData.searching && !state.matchData.searchCanceling) {
      sendMessageToWebsocket(WebsocketConnectionEnum.FIND_MATCH, findMatchCancelRequest)
    } else {
      throw new Error("Can't cancel match search...");
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.searchCancelFailure(e.message))
  }
}


export async function getMatchState(matchId: number): Promise<void> {
  try {
    const res = await getMatchStateAxios(matchId)
    const match = mapToMatch(res.data)
    const activeMatch: boolean = !res.data.finished;
    const matchRecord = res.data.matchRecord; 
    const matchRecordString: Array<string> = [];
    const viewedMove = res.data.matchRecord.length - 1;

    for (let i: number = 0; i < matchRecord.length; i++) {
      matchRecordString.push(chessMoveToString(matchRecord[i]));
    }

    const state: RootState = store.getState();

    let myMatch: boolean = false;
    let myColor: ChessColor = ChessColor.white;
    let myTurn: boolean = false;

    let enPassantPawnCoords: IChessCoords | null = null;
      
    for (let i = 0; i < res.data.matchRecord.length; i++) {
      enPassantPawnCoords = makeChessMoveForward(match.boardState,  matchRecord[i])
    }

    match.enPassantPawnCoords = enPassantPawnCoords;

    
    if (state.authData.loggedIn && state.authData.username) {

      const username: string = state.authData.username;

      if (isUserInMatch(res.data.usersInMatch, username)) {
        myMatch = true;
        myColor = getColorByUsername(res.data.usersInMatch, username);
        myTurn = activeMatch && myColor === getUserColorByMoveNumber(matchRecord.length);
      }
    }

    store.dispatch(matchSlice.actions.getMatchStateSuccess({
      match: match,
      matchRecord: matchRecord,
      matchRecordString: matchRecordString,
      viewedMoveNumber: viewedMove,
      activeMatch: activeMatch,
      myMatch: myMatch,
      myColor: myColor,
      myTurn: myTurn,
      matchId: matchId
    } as IGetMatchStateDTO));

  } catch (e: any) {
    console.error(e)
    store.dispatch(matchSlice.actions.getMatchStateFailure(e.message))
  }
}

export async function getMatchStateAndSubscribeToMatch(matchId: number): Promise<void> {
  await getMatchState(matchId);
  const matchData: MatchState = store.getState().matchData;

  if (matchData.subscribed) {
    sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_MATCH, chessMatchInfoRequest);
  } else if (!matchData.subscribing && matchId === matchData.matchId && matchData.activeMatch) {
    subscribeToChessMatch();
  }
}

export async function getUsersRatingsData(matchId: number): Promise<void> {
  try {
    const res = await getUsersRatingsDataAxios(matchId);
    store.dispatch(matchSlice.actions.getUsersRatingsDataSuccess(res.data));
  } catch (e: any) {
    console.error(e)
  }
}

export function subscribeToChessMatch(): void {
  const state: RootState = store.getState();

  if (state.matchData.matchId > 0 && !state.matchData.subscribing && !state.matchData.subscribed) {
    store.dispatch(matchSlice.actions.subscribingStart());
    connectToWebsocket(WebsocketConnectionEnum.CHESS_MATCH, onConnectedToChessMatch, onChessMatchWebsocketClose, onChessMatchError, chessMatchBeforeConnect, state.matchData.matchId);
  } else {
    const errorMessage: string = "Can't subscribe to match - there is no matchId in the store";
    store.dispatch(matchSlice.actions.subscribeFailure(errorMessage));
    throw new Error(errorMessage);
  }
}

function onConnectedToChessMatch(): void  {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_MATCH);
  client.subscribe(Endpoints.RESOURCES.CHESS_MATCH_SUBSCRIBE, onChessMatchMessageReceived);
  store.dispatch(matchSlice.actions.subscribeSuccess());
  sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_MATCH, chessMatchInfoRequest);
};

function onChessMatchWebsocketClose(evt: CloseEvent): void {
  console.log("Close event code: " + evt.code);
  if (![1000, 1002, 1006, 1010, 1011, 1012, 1013, 1014, 1015].includes(evt.code)) {
    const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_MATCH);
    client.deactivate();
    store.dispatch(matchSlice.actions.subscribeFailure("Connection closed by server"));
  }
};

function onChessMatchError(message: IMessage): void  {
  const headers: StompHeaders = message.headers;
  const customError: string = headers["Close-Connection"];

  if (customError === "true") {
    const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_MATCH);
    client.deactivate();
    store.dispatch(matchSlice.actions.subscribeFailure(message.body));
  }

  console.error(message.body);
};

async function chessMatchBeforeConnect(): Promise<void> {
  const client: CompatClient = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_MATCH);
  const clientConnectHeaders: StompHeaders = client.connectHeaders;

  const state: RootState = store.getState();

  if (state.authData.loggedIn) {
    const accessToken: string | null = await getAccessToken();

    if (accessToken) {
      clientConnectHeaders["X-Authorization"] = "Bearer " + accessToken;
    }
  }
}

function onChessMatchMessageReceived(message: IMessage): void {
  const response: IChessMatchWebsocketResponse = JSON.parse(message.body)
  let client: CompatClient;
  
  switch(response.type) {
    case ChessMatchWebsocketResponseEnum.INFO:
      store.dispatch(matchSlice.actions.updateUsersInfo(response as IChessMatchInfoResponse));
      break;
    case ChessMatchWebsocketResponseEnum.CHESS_MOVE:
      makeChessMove((response as IChessMatchMoveOkResponse).chessMove);
      break;
    case ChessMatchWebsocketResponseEnum.CHESS_MOVE_BAD:
      console.error((response as IChessMatchBadResponse).message);
      store.dispatch(matchSlice.actions.sendChessMoveFailure());
      break;
    case ChessMatchWebsocketResponseEnum.DRAW:
      store.dispatch(matchSlice.actions.receiveDrawOffer((response as IChessMatchDrawResponse).drawOfferUserColor));
      break;
    case ChessMatchWebsocketResponseEnum.DRAW_BAD:
      console.error((response as IChessMatchBadResponse).message);
      store.dispatch(matchSlice.actions.offerDrawFailure());
      break;
    case ChessMatchWebsocketResponseEnum.REJECT_DRAW:
      store.dispatch(matchSlice.actions.offerDrawRejected());
      break;
    case ChessMatchWebsocketResponseEnum.REJECT_DRAW_BAD:
    case ChessMatchWebsocketResponseEnum.ACCEPT_DRAW_BAD:
      console.error((response as IChessMatchBadResponse).message);
      store.dispatch(matchSlice.actions.handleIncomingDrawOfferFinish());
      break;
    case ChessMatchWebsocketResponseEnum.SURRENDER_BAD:
      console.error((response as IChessMatchBadResponse).message);
      store.dispatch(matchSlice.actions.surrenderFailure());
      break;
    case ChessMatchWebsocketResponseEnum.SUBSCRIBED:
      store.dispatch(matchSlice.actions.updateOnUserSubscribed((response as IChessMatchUserSubscribedResponse).subscribedUserColor));
      break;
    case ChessMatchWebsocketResponseEnum.DISCONNECTED:
      store.dispatch(matchSlice.actions.updateOnUserDisconnected(response as IChessMatchUserDisconnectedResponse));
      break;
    case ChessMatchWebsocketResponseEnum.MATCH_RESULT:
      client = WebsocketClientsHolder.getInstance(WebsocketConnectionEnum.CHESS_MATCH);
      client.deactivate()
      store.dispatch(matchSlice.actions.finishChessMatch((response as IChessMatchResultResponse).matchResult));
      store.dispatch(matchSlice.actions.clearBoardState());
      getUsersRatingsData(store.getState().matchData.matchId);
      break;
    default:
      console.log("Response of unknown type:  ");
      console.log(response)
  }
}


export function sendChessMove(chessMoveEnd: ISelectChessPieceEnd) : void {
  try {
    const state: RootState = store.getState();
    const matchId: number = state.matchData.matchId;
    const newMoveStart: ISelectChessPieceStart | null = state.matchData.newMoveStart;
    const subscribed: boolean = state.matchData.subscribed;

    if (matchId >= 0 && newMoveStart && subscribed) {
      const chessMoveToSend: IChessMove = { startPiece: newMoveStart.startPiece, startCoords: newMoveStart.startCoords,
                                            endPiece: chessMoveEnd.endPiece, endCoords: chessMoveEnd.endCoords,
                                            castling: chessMoveEnd.castling, pawnPromotionPiece: chessMoveEnd.pawnPromotionPiece};
      if (!store.getState().matchData.sendingChessMove) {
        store.dispatch(matchSlice.actions.sendChessMoveStart(chessMoveToSend));
        sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_MATCH, createChessMatchMoveRequest(chessMoveToSend))
      }
      
    } else {
      throw new Error("matchId or newMoveStart is not found. Or you are not subscribed to the match")
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.sendChessMoveFailure())
    }
}

export function selectCertainChessMove(chessMoveNumber: number): void {
  const state: RootState = store.getState();
  const match: IMatch | null = state.matchData.match;
  const matchRecord: Array<IChessMoveFullData> | null = state.matchData.matchRecord;

  if (match && matchRecord) {
    if (chessMoveNumber < matchRecord.length && chessMoveNumber >= 0) {
      let direction: number = Math.sign(chessMoveNumber - state.matchData.viewedMoveNumber);
      let makeChessMoveFunction: (boardState: BoardState, chessMove: IChessMoveFullData) => (IChessCoords | null);

      if (direction === 0) {
        return;
      } else if (direction > 0) {
        makeChessMoveFunction = makeChessMoveForward;
      } else {
        makeChessMoveFunction = makeChessMoveBackward;
      }

      const newBoardState = _.cloneDeep(match.boardState);
      deleteSelectionFromBoardState(newBoardState);
      
      let enPassantPawnCoords: IChessCoords | null = match.enPassantPawnCoords;
      

      for (let i = state.matchData.viewedMoveNumber; i !== chessMoveNumber; i += direction) {
        enPassantPawnCoords = makeChessMoveFunction(newBoardState,  matchRecord[direction > 0 ? i + direction : i])
      }

      store.dispatch(matchSlice.actions.viewCertainChessMove({boardState: newBoardState, moveNumber: chessMoveNumber, enPassantPawnCoords: enPassantPawnCoords}))

    } else {
      throw new Error("Wrong chess move number")
    }
  } else {
    throw new Error("Match or match record is not found")
  }
}

function makeChessMove(chessMove: IChessMoveFullData): void {
  const state: RootState = store.getState();
  const match: IMatch | null = state.matchData.match;

  if (match) {
    if ((state.matchData.lastMoveNumber + 1) !== chessMove.moveNumber) {
      if (state.matchData.matchId > 0) {
        getMatchStateAndSubscribeToMatch(state.matchData.matchId);
        return;
      } else {
        throw new Error("There is no match id!");
      }
    }

    if (state.matchData.viewedMoveNumber === state.matchData.lastMoveNumber) {

      const newBoardState: BoardState = _.cloneDeep(match.boardState);
      deleteSelectionFromBoardState(newBoardState);

      const enPassantPawnCoords: IChessCoords | null = makeChessMoveForward(newBoardState, chessMove);

      store.dispatch(matchSlice.actions.makeChessMove({chessMove: chessMove, boardState: newBoardState, enPassantPawnCoords: enPassantPawnCoords}));
    } else {
      store.dispatch(matchSlice.actions.makeChessMove({chessMove: chessMove}));
    }
    
  } else {
    throw new Error("No match was found")
  }

}

export function offerDraw() : void {
  try {
    const matchData: MatchState = store.getState().matchData;

    if (!matchData.offeringDraw && !matchData.drawOfferReceived && !matchData.surrendering) {
        store.dispatch(matchSlice.actions.offerDrawStart());
        sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_MATCH, chessMatchDrawRequest);
        store.dispatch(matchSlice.actions.offerDrawSuccess());
    } else {
      throw new Error("Already offering draw or received draw or surrendering.")
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.offerDrawFailure())
    }
}

export function surrender() : void {
  try {
    const matchData: MatchState = store.getState().matchData;

    if (!matchData.surrendering) {
        store.dispatch(matchSlice.actions.surrenderStart());
        sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_MATCH, chessMatchSurrenderRequest);
    } else {
      throw new Error("Already surrendering.")
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.surrenderFailure())
    }
}

export function handleDrawOffer(accept: boolean) : void {
  try {
    store.dispatch(matchSlice.actions.handleIncomingDrawOfferStart());
    const request: IChessMatchWebsocketRequest = accept ? chessMatchAcceptDrawRequest: chessMatchRejectDrawRequest;
    sendMessageToWebsocket(WebsocketConnectionEnum.CHESS_MATCH, request);
    store.dispatch(matchSlice.actions.handleIncomingDrawOfferFinish());
  } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.handleIncomingDrawOfferFailure());
  }
}
