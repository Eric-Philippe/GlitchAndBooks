import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

enum LoginStatus {
  SIGN_IN,
  SIGN_UP,
  FORGOT_PASSWORD,
}

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mail, setMail] = useState("");
  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [formState, setFormState] = useState(LoginStatus.SIGN_IN);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const res = await fetch("/api/v1/account/login", {
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
      setMessage("Error while logging in");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "" || password === "" || mail === "") {
      setMessage("Please fill all the fields");
      return;
    }
    const data = { username, password, mail };

    try {
      const res = await fetch("/api/v1/account/create", {
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
      setMessage("Error while creating account");
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mail === "") {
      setMessage("Please fill the mail field");
      return;
    }

    const data = { mail };

    try {
      const res = await fetch("/api/v1/account/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 200) {
        const resMessage = await res.json();
        setSuccessMsg(resMessage.message);
        setMessage("");

        setTimeout(() => {
          setSuccessMsg("");
          setFormState(LoginStatus.SIGN_IN);
        }, 3000);
      } else {
        const response = await res.json();
        setMessage(response.message);
      }
    } catch (err) {
      setMessage("Error while sending mail");
    }
  };

  const handleToggleForm = () => {
    if (formState === LoginStatus.SIGN_IN) setFormState(LoginStatus.SIGN_UP);
    else setFormState(LoginStatus.SIGN_IN);

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
        <div
          id="success-msg"
          className={
            successMsg ? "alert alert-success" : "alert alert-success d-none"
          }
        >
          {successMsg && <p>{successMsg}</p>}
        </div>
        <h2 className="mb-4">
          {(formState === LoginStatus.SIGN_IN && "Sign in") ||
            (formState === LoginStatus.SIGN_UP && "Sign up") ||
            (formState === LoginStatus.FORGOT_PASSWORD && "Forgot password")}
        </h2>
        {formState !== LoginStatus.SIGN_UP ? (
          <div>
            {/** @SIGN_IN_FORM */}
            {formState === LoginStatus.SIGN_IN ? (
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
                    onClick={() => {
                      setFormState(LoginStatus.FORGOT_PASSWORD);
                    }}
                  >
                    Forgot password ?
                  </button>
                </div>
              </form>
            ) : (
              /** @FORGOT_PASSWORD_FORM */
              <form>
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
                    onClick={handleForgotPassword}
                  >
                    Send me a mail
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
