import React, { FC, FormEvent, useEffect, useState } from "react"
import { loginUser, registerUser } from "../../../services/AuthService";
import { checkPassword, checkUsername } from "../AuthCommon";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/ReduxHooks";
import { authSlice } from "../../../store/reducers/AuthReducer";
import styles from '../Auth.module.css';

const Login: FC = () => {

  const INCORRECT_USERNAME_OR_PASSWORD_TEXT: string = "Неверное имя пользователя или пароль";

  const authData = useAppSelector(state => state.authData);
  const dispatch = useAppDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [incorrectUsernameOrPassword, setIncorrectUsernameOrPassword] = useState(false);
  const [errorFromServer, setErrorFromServer] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newUsernameErrors: Array<string> = checkUsername(username);
    const newPasswordErrors: Array<string> = checkPassword(password);

    if (newUsernameErrors.length !== 0 || newPasswordErrors.length !== 0) {
      setIncorrectUsernameOrPassword(true);
    } else {
      setIncorrectUsernameOrPassword(false);
      loginUser({username, password});
    }
  };

  useEffect(() => {
    if (authData.loginRegisterError) {
      setErrorFromServer(authData.loginRegisterError);
      dispatch(authSlice.actions.clearLoginRegisterError());
    }

  }, [authData.loginRegisterError])

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <span className={styles.header}>ВХОД</span>
          <div className={styles.inputContainer}>
            <input
              type="text"
              required
              minLength={1}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label>Логин</label>		
          </div>

          <div className={styles.errorsContainer}></div>

          <div className={styles.inputContainer}>		
            <input
              type="password"
              required
              minLength={1}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Пароль</label>
          </div>

          <div className={styles.errorsContainer}>
            {incorrectUsernameOrPassword && <div className={styles.error}>{INCORRECT_USERNAME_OR_PASSWORD_TEXT}</div>}
            {errorFromServer && <div className={styles.error}>{errorFromServer}</div>}
          </div>

          <button className={styles.myButton}>ОТПРАВИТЬ</button>

          <div className={styles.goToAnotherAuthPageText}>Ещё не с нами? <Link className={styles.link} to="/register">Зарегистрируйтесь!</Link></div>
        </form>	
      </div>
    </div>

  )
}

export default Login;