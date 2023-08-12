import React, { useState } from "react";

import "./Login.css";
import { isConnected } from "../middlewares/auth";

const Home: React.FC = () => {
  isConnected().then((res) => {
    if (!res) {
      window.location.href = "/login";
    }
  });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // log off button
  return (
    <div>
      <h1>Welcome</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        Log Off
      </button>
    </div>
  );
};

export default Home;
