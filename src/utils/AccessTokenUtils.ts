import { IAccessTokenInfo } from "../models/IAccessTokenInfo";
import { store } from "../store/store";

export const getTokenExpirationTime = (token: string | null): number | null => {
  if (!token) {
    return null;
  }

  const tokenInfo = token.split('.')[1]
  const tokenInfoDecoded = window.atob(tokenInfo)
  const { exp }: IAccessTokenInfo = JSON.parse(tokenInfoDecoded)

  return exp
}

export const isTokenExpired = () : boolean => {
  const tokenExpirationTime = store.getState().loginData.accessTokenExpirationTime

  if (!tokenExpirationTime) {
    return true
  }

  // there should be at least 30 seconds until token expires
  if ( tokenExpirationTime < (+ new Date() / 1000 + 30 ) ) {
    return true
  } else {
    return false
  }
}