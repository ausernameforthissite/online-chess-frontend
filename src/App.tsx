import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./hooks/ReduxHooks";
import Login from "./pages/login/Login";
import Main from "./pages/main/Main";
import Match from "./pages/match/Match";
import Register from "./pages/register/Register";
import AuthService from "./services/AuthService";
import { authSlice } from "./store/reducers/AuthReducer";
import { myHistory } from "./utils/History";
import { HistoryRouter } from "./utils/HistoryRouter";



function App() {

  const isLoggedIn: boolean = useAppSelector(state => state.authData.loggedIn)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isLoggedIn) {

      AuthService.getAccessToken();
     
    }
  }, [])

  
  return (
    <HistoryRouter history={myHistory}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login /> }
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register /> }
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