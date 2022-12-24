import {AnyAction, combineReducers, configureStore, Reducer} from "@reduxjs/toolkit";
import LoginReducer from "./reducers/LoginReducer";
import logger from 'redux-logger'
import RegisterReducer from "./reducers/RegisterReducer";
import ProfileReducer from "./reducers/ProfileReducer";
import MatchReducer from "./reducers/MatchReducer";

const combinedReducer = combineReducers({
    loginData: LoginReducer,
    registerData: RegisterReducer,
    profileData: ProfileReducer,
    matchData: MatchReducer
})

export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "login/logoutResult") {
    state = {} as RootState;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...(process.env.NODE_ENV !== 'production' ? [logger] : [])),
})



export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']