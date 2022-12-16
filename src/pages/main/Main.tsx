import React, { FC, Fragment } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { useAppSelector } from "../../hooks/ReduxHooks";
import AuthService from "../../services/AuthService";
import ProfileService from "../../services/ProfileService";


const Main: FC = () => {

  const isLoggedIn: boolean = useAppSelector(state => state.loginData.isLoggedIn)
  const profile: string | null = useAppSelector(state => state.profileData.profile)

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    AuthService.logoutUser()
  };

  const handleLoadProfile = (e: React.MouseEvent) => {
    e.preventDefault();

    ProfileService.loadUserProfile()
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
        </Fragment>
      : <p>Вы неавторизованы!</p>}
    </Fragment>

  )
}

export default Main;