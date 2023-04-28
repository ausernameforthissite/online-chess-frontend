import React, { FC, useState } from "react";
import IMAGE_PATHS from "../../images/ImagesConstants";
import OutsideClickHandler from 'react-outside-click-handler';
import PopUpUserMenu from "../pop-up-user-menu/PopUpUserMenu";
import styles from './Navbar.module.css';
import { useAppSelector } from "../../hooks/ReduxHooks";
import { myHistory } from "../../utils/History";
import { Link } from "react-router-dom";



const Navbar: FC = () => {

  const [showPopUpUserMenu, setShowPopUpUserMenu] = useState(false);
  
  const authData = useAppSelector(state => state.authData);

  const handleOpenMenuClick = (e: React.MouseEvent) => {
    setShowPopUpUserMenu(!showPopUpUserMenu);
  }

  const closeWindow = () => {
    setShowPopUpUserMenu(false);
  };


  return (
     <div className={styles.navbar}>
      <Link to="/">
        <img className={styles.siteLogo} src={IMAGE_PATHS.siteLogo} alt="" />
      </Link>

      

      <div className={styles.userInfoContainer}>
        {authData.loggedIn && <div className={styles.username}>{authData.username}</div>}
        <div className={styles.outsideClick}>
          <OutsideClickHandler onOutsideClick={closeWindow} disabled={!showPopUpUserMenu}>
            {authData.loggedIn ?
              <img className={styles.openMenuIcon} src={IMAGE_PATHS.menuIcon} alt="" onClick={handleOpenMenuClick} />
            :
              <span className={styles.openMenuIcon} onClick={handleOpenMenuClick}>войти</span>
            }
            {showPopUpUserMenu &&
              <PopUpUserMenu closeWindow={closeWindow}/>
            }
          </OutsideClickHandler>
        </div>
      </div>

    </div>
  )
}

export default Navbar;