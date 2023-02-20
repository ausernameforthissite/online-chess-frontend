import { fetchEventSource } from "@microsoft/fetch-event-source";
import _ from "lodash";
import { findMatchAxios, getMatchStateAxios, sendChessMoveAxios } from "../api/axiosFunctions/MatchAxiosFunctions";
import Endpoints from "../api/Endpoints";
import { BoardState } from "../models/chess-game/BoardState";
import { ChessColor, IChessCoords } from "../models/chess-game/ChessCommon";
import { chessMoveToString, IChessMove, IChessMoveFullData } from "../models/chess-game/IChessMove";
import { IMatch } from "../models/chess-game/IMatch";
import { getColorByUsername, getCurrentTurnUsername, isUserInMatch} from "../models/chess-game/IUsersInMatch";
import { ISelectChessPieceEnd, ISelectChessPieceStart } from "../models/DTO/match/ISelectChessPiece";
import { SubscribeResponse, SubscribeResponseTypeEnum } from "../models/DTO/match/ISubscribeResponse";
import { matchSlice } from "../store/reducers/MatchReducer";
import { RootState, store } from "../store/store";
import { deleteSelectionFromBoardState, makeChessMoveBackward, makeChessMoveForward } from "../utils/ChessGameUtils";
import { myHistory } from "../utils/History";
import AuthService from "./AuthService";



export default class MatchService {

  static abortController: AbortController = new AbortController();


  static async findMatch() : Promise<void> {
    try {

      store.dispatch(matchSlice.actions.searchStart())
      const res = await findMatchAxios()
      store.dispatch(matchSlice.actions.searchSuccess(res.data))
      myHistory.push(`/match/${res.data.matchId}`)

    } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.searchFailure(e.message))
    }
  }


  static async getMatchState(matchId: number) : Promise<void> {
    try {

      const res = await getMatchStateAxios(matchId)
      const match = res.data.match;
      const matchRecord = res.data.matchRecord; 
      const matchRecordString: Array<string> = [];
      const viewedMove = matchRecord.length - 1;

      for (let i: number = 0; i < matchRecord.length; i++) {
        matchRecordString.push(chessMoveToString(matchRecord[i]));
      }

      const state: RootState = store.getState();

      let activeMatch: boolean = res.data.match.finished ? false : true;
      let myMatch: boolean = false;
      let myTurn: boolean = false;
      let myColor: ChessColor = ChessColor.white;
      
 
      
      if (state.authData.loggedIn) {

        const username: string = <string>state.authData.username;

        if (isUserInMatch(res.data.match.usersInMatch, username)) {
          myMatch = true;
          myColor = getColorByUsername(res.data.match.usersInMatch, username);
          myTurn = username === getCurrentTurnUsername(res.data.match.usersInMatch)
        }
      }

      store.dispatch(matchSlice.actions.getMatchStateSuccess({
        match: match,
        matchRecord: matchRecord,
        matchRecordString: matchRecordString,
        viewedMove: viewedMove,
        activeMatch: activeMatch,
        myMatch: myMatch,
        myTurn: myTurn,
        myColor: myColor,
        matchId: matchId
      }));

    } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.getMatchStateFailure(e.message))
    }
  }


  static async subscribeToMatch(): Promise<void> {
    const state: RootState = store.getState();
    const matchId: number = state.matchData.matchId;
    
    const accessToken = await AuthService.getAccessToken()
    if (accessToken) {
        const authorization = `Bearer ${accessToken}`


        console.log("subscribe start")
        fetchEventSource(Endpoints.RESOURCES.MATCH_BASE + matchId + "/subscribe", {
          method: "GET",

          headers: {
            Accept: "text/event-stream",
            Authorization: authorization
          },
          async onopen(response) {
            console.log("on open")
           store.dispatch(matchSlice.actions.subscribeSuccess())
          },
          onmessage(event) {
            const receivedChessMove: SubscribeResponse = JSON.parse(event.data);

            if (receivedChessMove.type !== undefined && receivedChessMove.type === SubscribeResponseTypeEnum.ok) {
              console.log("Ok response!!!")

            } else {
              MatchService.makeChessMove(receivedChessMove as IChessMoveFullData);
            }

          },
          onclose() {
            console.log("Connection closed by the server");
  
            // if (state.matchData.activeMatch && !state.matchData.subscribed) {
            //   MatchService.subscribeToMatch();
            // }
          },
          onerror(error) {
           store.dispatch(matchSlice.actions.subscribeFailure(error))
          },
         });
    } else {
      throw new Error("accessToken is not found")
    }
  }

 static async sendChessMove(chessMoveEnd: ISelectChessPieceEnd) : Promise<void> {
  try {
    const state: RootState = store.getState();
    const matchId: number = state.matchData.matchId;
    const newMoveStart: ISelectChessPieceStart | null = state.matchData.newMoveStart;

    if (matchId >= 0 && newMoveStart) {
      const chessMoveToSend: IChessMove = { startPiece: newMoveStart.startPiece, startCoords: newMoveStart.startCoords,
                                            endPiece: chessMoveEnd.endPiece, endCoords: chessMoveEnd.endCoords,
                                            castling: chessMoveEnd.castling, pawnPromotionPiece: chessMoveEnd.pawnPromotionPiece};
      store.dispatch(matchSlice.actions.sendChessMoveStart())
      await sendChessMoveAxios(matchId, chessMoveToSend);
      store.dispatch(matchSlice.actions.sendChessMoveSuccess())
    } else {
      throw new Error("matchId or newMoveStart is not found")
    }
  } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.sendChessMoveFailure(e.message))
    }
  }

  static makeChessMove(chessMove: IChessMoveFullData): void {
    const state: RootState = store.getState();
    const match: IMatch | null = state.matchData.match;

    if (match && state.matchData.matchRecord) {
      if (state.matchData.viewedMove === state.matchData.matchRecord.length - 1) {
        const newBoardState: BoardState = _.cloneDeep(match.boardState);
        deleteSelectionFromBoardState(newBoardState);
  
        let enPassantPawnCoords: IChessCoords | null = null
  
        makeChessMoveForward(newBoardState, enPassantPawnCoords, chessMove)
  
        store.dispatch(matchSlice.actions.makeChessMove({boardState: newBoardState, chessMove: chessMove, enPassantPawnCoords: enPassantPawnCoords}));
      } else {
        store.dispatch(matchSlice.actions.makeChessMove({chessMove: chessMove}));
      }
     
    } else {
      throw new Error("Match is not found")
    }

  }

  static selectCertainChessMove(chessMoveNumber: number): void {
    const state: RootState = store.getState();
    const match: IMatch | null = state.matchData.match;
    const matchRecord: Array<IChessMoveFullData> | null = state.matchData.matchRecord;

    if (match && matchRecord) {
      if (chessMoveNumber < matchRecord.length && chessMoveNumber >= 0) {
        let direction: number = Math.sign(chessMoveNumber - state.matchData.viewedMove);
        let makeChessMoveFunction: (boardState: BoardState, enPassantPawnCoords: IChessCoords | null, chessMove: IChessMoveFullData) => void;

        if (direction === 0) {
          return;
        } else if (direction > 0) {
          makeChessMoveFunction = makeChessMoveForward;
        } else {
          makeChessMoveFunction = makeChessMoveBackward;
        }

        const newBoardState = _.cloneDeep(match.boardState);
        deleteSelectionFromBoardState(newBoardState);
        let enPassantPawnCoords = match.enPassantPawnCoords;
        

        for (let i = state.matchData.viewedMove; i != chessMoveNumber; i += direction) {
          makeChessMoveFunction(newBoardState, enPassantPawnCoords, matchRecord[direction > 0 ? i + direction : i ])
        }

        store.dispatch(matchSlice.actions.viewCertainChessMove({boardState: newBoardState, moveNumber: chessMoveNumber, enPassantPawnCoords: enPassantPawnCoords}))

      } else {
        throw new Error("Wrong chess move number")
      }
    } else {
      throw new Error("Match is not found")
    }
  }
}

