import { FC, Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/ReduxHooks";
import { logoutUser } from "../../services/AuthService";
import { myHistory } from "../../utils/History";
import styles from './PopUpUserMenu.module.css';

type Props = {
  closeWindow: () => void
}

const PopUpUserMenu: FC<Props> = ({ closeWindow }: Props) => {

  const authData = useAppSelector(state => state.authData)


  const profile = (e: React.MouseEvent) => {
    e.preventDefault();

    closeWindow();
    myHistory.push(`profile/${authData.username}`);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    closeWindow();
    logoutUser();
  };

  const login = (e: React.MouseEvent) => {
    e.preventDefault();

    closeWindow();
    myHistory.push('/login');
  };

  const register = (e: React.MouseEvent) => {
    e.preventDefault();

    closeWindow();
    myHistory.push('/register');
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