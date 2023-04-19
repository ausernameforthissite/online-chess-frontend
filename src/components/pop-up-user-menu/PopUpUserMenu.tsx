import { FC, Fragment } from "react";
import { useAppSelector } from "../../hooks/ReduxHooks";
import { logoutUser } from "../../services/AuthService";
import { myHistory } from "../../utils/History";
import styles from './PopUpUserMenu.module.css';

type Props = {
  showWindow: (show: boolean) => void
}

const PopUpUserMenu: FC<Props> = ({showWindow}: Props) => {

  const authData = useAppSelector(state => state.authData)


  const profile = (e: React.MouseEvent) => {
    e.preventDefault();

    showWindow(false);
    myHistory.push(`profile/${authData.username}`);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    showWindow(false);
    logoutUser();
  };

  const login = (e: React.MouseEvent) => {
    e.preventDefault();

    showWindow(false);
    myHistory.push('/login');
  };

  const register = (e: React.MouseEvent) => {
    e.preventDefault();

    showWindow(false);
    myHistory.push('/register');
  };




  return (
      <div className={styles.menu}>
        <div className={styles.menuOptionsContainer}>
          {authData.loggedIn ? 
            <Fragment>
              <div className={styles.menuOption} onClick={profile}>Профиль</div>
              <div className={styles.menuOption} onClick={handleLogout}>Выйти</div>
            </Fragment>
            :
            <Fragment>
              <div className={styles.menuOption} onClick={login}>Войти</div>
              <div className={styles.menuOption} onClick={register}>Зарегистрироваться</div>
            </Fragment>
          }
        </div>

      </div>
  );
};


export default PopUpUserMenu;