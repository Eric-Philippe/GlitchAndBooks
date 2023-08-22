import React, { useState } from "react";

import { REACT_APP_API_URL } from "../env";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le comportement de soumission du formulaire par défaut

    const data = { username, password };

    try {
      const res = await fetch(REACT_APP_API_URL + "/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        setMessage("Échec de la connexion.");
      } else {
        const response = await res.json();
        const token = response.token;
        const loginInformations = response.data[0];

        localStorage.setItem("token", token);
        localStorage.setItem("username", loginInformations.username);
        localStorage.setItem("userid", loginInformations.userid);

        window.location.href = "/";
      }
    } catch (err) {
      console.error("Erreur lors de la connexion :", err);
    }
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100 ">
      <div className="login-form col-md-4">
        <div
          id="error-msg"
          className={
            message ? "alert alert-danger" : "alert alert-danger d-none"
          }
        >
          {message && <p>{message}</p>}
        </div>
        <h2 className="mb-4">Login</h2>

        <form onSubmit={handleLogin} noValidate>
          <div className="mb-3">
            <label htmlFor="inputUsername" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="inputUsername"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="inputPassword"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
