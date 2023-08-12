// src/App.tsx
import React from "react";
import "./App.css";
import Login from "./Login";

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Login />
      </header>
    </div>
  );
};

export default App;
