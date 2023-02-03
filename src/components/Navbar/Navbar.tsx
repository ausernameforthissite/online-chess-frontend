import React, { FC, Fragment } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/ReduxHooks";


const Navbar: FC = () => {

  const isLoggedIn: boolean = useAppSelector(state => state.authData.loggedIn)

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Main</Link>
        </li>
        <li>
          <Link to="/match">Match</Link>
        </li>
        {!isLoggedIn && 
          <Fragment>
            <li>
              <Link to="/login">Login</Link>
            </li><li>
              <Link to="/register">Register</Link>
            </li>
          </Fragment>
        }
      </ul>
    </nav>
  )
}

export default Navbar;