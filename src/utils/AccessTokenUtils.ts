import { IAccessTokenInfo } from "../models/IAccessTokenInfo";

export const getTokenInfo = (token: string): IAccessTokenInfo => {
  const tokenInfo = token.split('.')[1]
  const tokenInfoDecoded = window.atob(tokenInfo)
  return JSON.parse(tokenInfoDecoded) as IAccessTokenInfo
}


export const isTokenExpired = (tokenExpirationTime: number | null) : boolean => {
  if (tokenExpirationTime == null) {
    return true;
  }
  // there should be at least 30 seconds until token expires
  if ( tokenExpirationTime < (+ new Date() / 1000 + 30 ) ) {
    return true
  } else {
    return false
  }
}