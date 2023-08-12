import React, { useState } from "react";

import "./Login.css";
import { isConnected } from "../middlewares/auth";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    const data = { username, password };

    try {
      fetch("http://localhost:3005/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.status !== 200) {
          setMessage("Login failed.");
        } else {
          const { token } = await res.json();
          localStorage.setItem("token", token); // Store the token in localStorage
          window.location.href = "/";
          setMessage("");
        }
      });
    } catch (err) {}
  };

  return (
    <div>
      {message && (
        <div id="error-msg">
          <p>{message}</p>
        </div>
      )}
      <h2>Login</h2>
      <form onSubmit={handleLogin} noValidate>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
