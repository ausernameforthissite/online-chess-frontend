import axios, { AxiosError } from "axios";
import { findMatch, loadProfile } from "../api/axiosFunctions/ProfileAxiosFunctions";
import { IFindMatchError } from "../models/IFindMatchError";
import { matchSlice } from "../store/reducers/MatchReducer";
import { profileSlice } from "../store/reducers/ProfileReducer";
import { store } from "../store/store";
import { history } from "../utils/History";


export default class ProfileService {

  static async loadUserProfile() : Promise<void> {
    try {

      store.dispatch(profileSlice.actions.loadProfileStart())
      const res = await loadProfile()
      store.dispatch(profileSlice.actions.loadProfileSucess(res.data))

    } catch (e: any) {
      console.error(e)
      store.dispatch(profileSlice.actions.loadProfileFailure(e.message))
    }
  }

  static async findUserMatch() : Promise<void> {
    try {

      store.dispatch(matchSlice.actions.findMatchStart())
      const res = await findMatch()
      store.dispatch(matchSlice.actions.findMatchSucess(res.data))

    } catch (error: any) {

      let message = error.message;

      console.log(message);

      if (axios.isAxiosError(error)) {
        const serverError = error as AxiosError<IFindMatchError>;
        if (serverError && serverError.response) {
          message = serverError.response.data.message;
        }
      }

      
      store.dispatch(matchSlice.actions.findMatchFailure(message))
    }
  }

}


