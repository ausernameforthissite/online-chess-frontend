import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { useAppSelector } from "./hooks/ReduxHooks";
import Login from "./pages/login/Login";
import SearchGame from "./pages/search-game/SearchGame";
import Match from "./pages/match/Match";
import Profile from "./pages/profile/Profile";
import Rating from "./pages/rating/Rating";
import Register from "./pages/register/Register";
import { getAccessToken } from "./services/AuthService";
import { myHistory } from "./utils/History";
import { HistoryRouter } from "./utils/HistoryRouter";



function App() {

  const loggedIn: boolean = useAppSelector(state => state.authData.loggedIn)

  useEffect(() => {
    if (!loggedIn) {

      getAccessToken();
     
    }
  }, [])

  
  return (
    <HistoryRouter history={myHistory}>
      <Navbar/>
      <Routes>
        <Route path="/" element={<SearchGame />} />
        <Route path="/rating" element={<Rating />} />
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/" /> : <Login /> }
        />
        <Route
          path="/register"
          element={loggedIn ? <Navigate to="/" /> : <Register /> }
        />
        <Route
          path="/profile/:username"
          element={<Profile />}
        />
        <Route
          path="/match/:id"
          element={<Match />}
        />
      </Routes>
    </HistoryRouter>

  );
}

export default App;