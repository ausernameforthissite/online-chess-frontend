import React, { FC, FormEvent, useState } from "react"
import { registerUser } from "../../services/AuthService";
import styles from '../Auth.module.css';

const Register: FC = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password === passwordRepeat) {
      setPasswordError("")
      registerUser({username, password})
    } else {
      setPasswordError("Введённые пароли не совпадают!")
    }
  };


  return (

    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit}>
        <span className={styles.textCenter}>login</span>
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

        {passwordError && <div>{passwordError}</div>}
        <button type="button" className={styles.myButton}>Отправить</button>
      </form>	
    </div>

    // <form onSubmit={handleSubmit}>
    //   <div>
    //     <label htmlFor="username">Username:</label>
    //     <input
    //       name="username"
    //       type="text"
    //       value={username}
    //       onChange={(e) => setUsername(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="password">Password:</label>
    //     <input
    //       name="password"
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <label htmlFor="passwordRepeat">Repeat password:</label>
    //     <input
    //       name="passwordRepeat"
    //       type="password"
    //       value={passwordRepeat}
    //       onChange={(e) => setPasswordRepeat(e.target.value)}
    //     />
    //   </div>
    //   {passwordError && <div>{passwordError}</div>}
    //   <button>Submit</button>
    // </form>
  )
}

export default Register