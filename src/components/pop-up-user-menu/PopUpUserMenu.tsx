import { FC, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/ReduxHooks";
import { logoutUser } from "../../services/AuthService";
import styles from './PopUpUserMenu.module.css';

type Props = {
  closeWindow: () => void
}

const PopUpUserMenu: FC<Props> = ({ closeWindow }: Props) => {

  const authData = useAppSelector(state => state.authData)

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    closeWindow();
    logoutUser();
  };




  return (
      <div className={styles.menu}>
        <div className={styles.menuOptionsContainer}>
          {authData.loggedIn ? 
            <Fragment>
              <NavLink className={styles.navLink} to={`/profile/${authData.username}`}>
                <div className={styles.menuOption} onClick={closeWindow}>Профиль</div>
              </NavLink>
              <div className={styles.menuOption} onClick={handleLogout}>Выйти</div>
            </Fragment>
            :
            <Fragment>
              <NavLink className={styles.navLink}to="/login">
                <div className={styles.menuOption} onClick={closeWindow}>Войти</div>
              </NavLink>
              <NavLink className={styles.navLink} to="/register">
                <div className={styles.menuOption} onClick={closeWindow}>Зарегистрироваться</div>
              </NavLink>
            </Fragment>
          }
        </div>

      </div>
  );
};


export default PopUpUserMenu;