import React, { FC, Fragment, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import { useAppSelector } from "../../hooks/ReduxHooks";
import AuthService from "../../services/AuthService";
import MatchService from "../../services/MatchService";



const Main: FC = () => {

  const isLoggedIn: boolean = useAppSelector(state => state.authData.loggedIn)
  const username: string | null = useAppSelector(state => state.authData.username)
  const visible: boolean = useAppSelector(state => state.matchData.searching)

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    AuthService.logoutUser()
  };

  const handleFindMatch = (e: React.MouseEvent) => {
    e.preventDefault();

    MatchService.findMatch()
  };


  return (
    <Fragment>
      <Navbar/>
      {/* <ModalWindow visible={visible}>
        Text
      </ModalWindow> */}
      <h1>
        Main page
      </h1>
      {isLoggedIn ? 
        <Fragment>
          <p>Hello, user {username}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleFindMatch}>Find match</button>
        </Fragment>
      : <p>Вы неавторизованы!</p>}
    </Fragment>

  )
}

export default Main;