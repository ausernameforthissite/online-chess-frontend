import React, { FC, useState } from "react";
import IMAGE_PATHS from "../../images/ImagesConstants";
import OutsideClickHandler from 'react-outside-click-handler';
import UserActionsModalWindow from "../user-actions-modal-window/UserActionsModalWindow";
import styles from './Navbar.module.css';



const Navbar: FC = () => {

  const [showUserActionsWindow, setShowUserActionsWindow] = useState(false);

  const handleMenuIconClick = (e: React.MouseEvent) => {

    setShowUserActionsWindow(!showUserActionsWindow);

  }

  const handleOutsideClick = () => {
    setShowUserActionsWindow(false);
  };


  return (
    <nav className={styles.navbar}>
      <img className={styles.siteLogo} src={IMAGE_PATHS.siteLogo} alt=""/>
      

      <div className={styles.userInfoContainer}>
        <div className={styles.username}>Test user</div>
        <div className={styles.outsideClick}>
          <OutsideClickHandler onOutsideClick={handleOutsideClick} disabled={!showUserActionsWindow}>
            <img className={styles.openMenuIcon} src={IMAGE_PATHS.menuIcon} alt="" onClick={handleMenuIconClick} />

            {showUserActionsWindow &&
              <UserActionsModalWindow showWindow={setShowUserActionsWindow}/>
            }
          </OutsideClickHandler>
        </div>
      </div>

    </nav>
  )
}

export default Navbar;