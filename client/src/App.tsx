import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import AddBook from "./pages/AddBook";
import Browse from "./pages/Browse";
import Stats from "./pages/Stats";
import ResetPassword from "./pages/ResetPassword";
import Account from "./pages/Account";
import WishList from "./pages/Wishlist";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/add" Component={AddBook} />
        <Route path="/browse" Component={Browse} />
        <Route path="/wishlist" Component={WishList} />
        <Route path="/stats" Component={Stats} />
        <Route path="/account" Component={Account} />
        <Route path="/resetpassword" Component={ResetPassword} />
        <Route path="*" Component={NotFound} />
      </Routes>
    </Router>
  );
};

export default App;
