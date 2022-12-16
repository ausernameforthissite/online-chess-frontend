import React, { FC, FormEvent, useState } from "react"
import AuthService from "../../services/AuthService";


const Register: FC = () => {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (password === passwordRepeat) {
      setPasswordError("")
      AuthService.registerUser({username, password})
    } else {
      setPasswordError("Введённые пароли не совпадают!")
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="passwordRepeat">Repeat password:</label>
        <input
          name="passwordRepeat"
          type="password"
          value={passwordRepeat}
          onChange={(e) => setPasswordRepeat(e.target.value)}
        />
      </div>
      {passwordError && <div>{passwordError}</div>}
      <button>Submit</button>
    </form>
  )
}

export default Register