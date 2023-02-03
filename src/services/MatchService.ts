

import { plainToClass } from "class-transformer";
import _ from "lodash";
import { loginAxios, logoutAxios, refreshTokenAxios, registerAxios } from "../api/axiosFunctions/AuthAxiosFunctions";
import { findMatchAxios, getMatchStateAxios } from "../api/axiosFunctions/MatchAxiosFunctions";
import { ChessColor } from "../models/chess-game/ChessCommon";
import { ChessPiece } from "../models/chess-game/exports";
import { IMatch } from "../models/chess-game/IMatch";
import { UsersInMatch } from "../models/chess-game/UsersInMatch";
import { IAuthRequest } from "../models/DTO/auth/IAuthRequest";
import { authSlice } from "../store/reducers/AuthReducer";
import { matchSlice } from "../store/reducers/MatchReducer";
import { RootState, store } from "../store/store";
import { myHistory } from "../utils/History";



export default class MatchService {


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

      const state: RootState = store.getState();

      res.data.match.myTurn = false;
      res.data.match.myColor = ChessColor.white;
      
      if (!state.authData.loggedIn) {
        res.data.match.myMatch = false;

      } else {
        const username: string = <string>state.authData.username;


        res.data.match.usersInMatch = plainToClass(UsersInMatch, res.data.match.usersInMatch);
        console.log(res.data)
        res.data.match.myMatch = (<UsersInMatch>res.data.match.usersInMatch).isUserInMatch(username)

  
        if (res.data.match.myMatch) {
          res.data.match.myTurn = !res.data.match.finished && username === res.data.match.usersInMatch.getCurrentTurnUsername();
          res.data.match.myColor = <ChessColor>res.data.match.usersInMatch.getColorByUsername(username);
        }
      }
      store.dispatch(matchSlice.actions.getMatchStateSuccess(res.data))

    } catch (e: any) {
      console.error(e)
      store.dispatch(matchSlice.actions.getMatchStateFailure(e.message))
    }
  }
}