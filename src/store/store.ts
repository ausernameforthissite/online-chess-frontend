import {AnyAction, CombinedState, combineReducers, configureStore, PayloadAction, Reducer} from "@reduxjs/toolkit";
import LoginReducer, { LoginState } from "./reducers/LoginReducer";
import logger from 'redux-logger'
import RegisterReducer, { RegisterState } from "./reducers/RegisterReducer";
import ProfileReducer, { ProfileState } from "./reducers/ProfileReducer";

const combinedReducer = combineReducers({
    loginData: LoginReducer,
    registerData: RegisterReducer,
    profileData: ProfileReducer
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