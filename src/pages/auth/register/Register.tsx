import React, { FC, FormEvent, useEffect, useState } from "react"
import { registerUser } from "../../../services/AuthService";
import { checkPassword, checkUsername } from "../AuthCommon";
import styles from '../Auth.module.css';
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/ReduxHooks";
import { authSlice } from "../../../store/reducers/AuthReducer";

const Register: FC = () => {

  const authData = useAppSelector(state => state.authData);
  const dispatch = useAppDispatch();


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [usernameErrors, setUsernameErrors] = useState<Array<string>>([]);
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([]);
  const [passwordRepeatError, setPasswordRepeatError] = useState("");

  const [errorFromServer, setErrorFromServer] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("handle submit");
    const newUsernameErrors: Array<string> = checkUsername(username);
    const newPasswordErrors: Array<string> = checkPassword(password);
    const newPasswordRepeatError: string = password !== passwordRepeat ? "Введённые пароли не совпадают!" : "";

    setUsernameErrors(newUsernameErrors);
    setPasswordErrors(newPasswordErrors);
    setPasswordRepeatError(newPasswordRepeatError);

    if (newUsernameErrors.length === 0 && newPasswordErrors.length === 0 && !newPasswordRepeatError) {
      registerUser({username, password});
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
          <span className={styles.header}>РЕГИСТРАЦИЯ</span>
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

          <div className={styles.errorsContainer}>
            {usernameErrors.map((message, i) => {
                return (
                  <div key={i} className={styles.error}>{message}</div>
                )
              })
            }
          </div>

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
            {passwordErrors.map((message, i) => {
                return (
                  <div key={i} className={styles.error}>{message}</div>
                )
              })
            }
          </div>

          <div className={styles.inputContainer}>		
            <input
                type="password"
                required
                minLength={1}
                value={passwordRepeat}
                onChange={(e) => setPasswordRepeat(e.target.value)}
              />
            <label>Ещё раз</label>
          </div>

          <div className={styles.errorsContainer}>
            {passwordRepeatError && <div className={styles.error}>{passwordRepeatError}</div>}
            {errorFromServer && <div className={styles.error}>{errorFromServer}</div>}
          </div>

          <button className={styles.myButton}>ОТПРАВИТЬ</button>

          <div className={styles.goToAnotherAuthPageText}>Уже зарегистрированы? <Link className={styles.link} to="/login">Войдите!</Link></div>
        </form>	
      </div>
    </div>

  )
}

export default Register