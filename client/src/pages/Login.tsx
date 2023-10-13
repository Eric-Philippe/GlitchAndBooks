import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const res = await fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status !== 200) {
        // Get the message from the response
        const resMessage = await res.json();
        setMessage(resMessage.message);
      } else {
        const response = await res.json();
        const token = response.token;
        const loginInformations = response.data[0];

        localStorage.setItem("token", token);
        localStorage.setItem("username", loginInformations.username);
        localStorage.setItem("userid", loginInformations.userid);
        localStorage.setItem("mail", loginInformations.email);

        window.location.href = "/";
      }
    } catch (err) {
      console.error("Error while logging in :", err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(username, password, mail);

    const data = { username, password, mail };

    try {
      const res = await fetch("/api/v1/createaccount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        const response = await res.json();

        localStorage.setItem("token", response.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userid", response.data.userid);
        localStorage.setItem("mail", response.data.email);

        window.location.href = "/";
      } else {
        const resMessage = await res.json();
        setMessage(resMessage.message);
      }
    } catch (err) {
      console.error("Error while creating account :", err);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {};

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    setMessage("");
    setMail("");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-container d-flex justify-content-center align-items-center vh-100">
      <div className="login-form col-md-4">
        <div
          id="error-msg"
          className={
            message ? "alert alert-danger" : "alert alert-danger d-none"
          }
        >
          {message && <p>{message}</p>}
        </div>
        <h2 className="mb-4">{isLogin ? "Login" : "Create an account"}</h2>
        {isLogin ? (
          <form onSubmit={handleSignIn} noValidate>
            <div className="mb-3">
              <label htmlFor="inputUsername" className="form-label">
                Username or mail
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
              <label htmlFor="inputPassword" className="form-label">
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
            <div className="mb-3">
              <button type="submit" className="btn btn-primary">
                Sign in
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleToggleForm}
                style={{ marginLeft: "10px" }}
              >
                Sign up
              </button>

              <button
                type="button"
                className="btn btn-link"
                onClick={handleForgotPassword}
              >
                Forgot password ?
              </button>
            </div>
          </form>
        ) : (
          <form>
            <div className="mb-3">
              <label htmlFor="inputUsername" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="inputUsername"
                value={username}
                required
                onChange={(e) => setUsername(e.target.value)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="inputPassword" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="inputPassword"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
            <div className="mb-3">
              <label htmlFor="inputMail" className="form-label">
                Mail
              </label>
              <input
                type="text"
                className="form-control"
                id="inputMail"
                value={mail}
                required
                onChange={(e) => setMail(e.target.value)}
              ></input>
            </div>
            <div className="mb-3">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSignUp}
              >
                Create account
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleToggleForm}
                style={{ marginLeft: "10px" }}
              >
                Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
