import { loadProfile } from "../api/axiosFunctions/ProfileAxiosFunctions";
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

}

