import React, { FC, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./hooks/ReduxHooks";
import Login from "./pages/login/Login";
import Main from "./pages/main/Main";
import Register from "./pages/register/Register";
import AuthService from "./services/AuthService";
import ProfileService from "./services/ProfileService";


function App() {

  const isLoggedIn: boolean = useAppSelector(state => state.loginData.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) {
      ProfileService.loadUserProfile()
    }
  }, [])

  return (
    <BrowserRouter>
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
      </Routes>
    </BrowserRouter>

  );
}

export default App;