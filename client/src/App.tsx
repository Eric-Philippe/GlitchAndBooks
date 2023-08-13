import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Ajouter from "./pages/Ajouter";
import Consulter from "./pages/Consulter";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/ajouter" Component={Ajouter} />
        <Route path="/consulter" Component={Consulter} />
        <Route path="*" Component={NotFound} />
      </Routes>
    </Router>
  );
};

export default App;
