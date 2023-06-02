import { AnyAction, combineReducers, configureStore, Reducer } from "@reduxjs/toolkit";
import authReducer from "./reducers/AuthReducer";
import logger from 'redux-logger'
import gameReducer from "./reducers/GameReducer";


const combinedReducer = combineReducers({
    authData: authReducer,
    gameData: gameReducer
})


export type RootState = ReturnType<typeof combinedReducer>;

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "auth/logoutResult") {
    state = {} as RootState;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(...(process.env.NODE_ENV !== 'production' ? [logger] : [])),
})



export default store;

export type AppStore = typeof store
export type AppDispatch = AppStore['dispatch']