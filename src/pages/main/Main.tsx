import React, { FC, Fragment } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useAppSelector } from "../../hooks/ReduxHooks";
import AuthService from "../../services/AuthService";
import ProfileService from "../../services/ProfileService";


const Main: FC = () => {

  const isLoggedIn: boolean = useAppSelector(state => state.loginData.isLoggedIn)
  const profile: string | null = useAppSelector(state => state.profileData.profile)
  const matchId: number | null = useAppSelector(state => state.matchData.matchId)
  const findMatchError: string | null = useAppSelector(state => state.matchData.error)

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    AuthService.logoutUser()
  };

  const handleLoadProfile = (e: React.MouseEvent) => {
    e.preventDefault();

    ProfileService.loadUserProfile()
  };

  const handleFindMatch= (e: React.MouseEvent) => {
    e.preventDefault();

    ProfileService.findUserMatch()
  };


  return (
    <Fragment>
      <Navbar/>
      <h1>
        Main page
      </h1>
      {isLoggedIn ? 
        <Fragment>
          <p>Hello, user {profile}</p>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleLoadProfile}>LoadProfile</button>
          <button onClick={handleFindMatch}>Find Match</button>
          
          {matchId ?
            <p>Match with id={matchId} was found</p>
          :
            <p>{findMatchError}</p>         
          }

        </Fragment>
      : <p>Вы неавторизованы!</p>}
    </Fragment>

  )
}

export default Main;