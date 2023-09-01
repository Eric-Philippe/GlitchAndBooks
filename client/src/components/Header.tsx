import React from "react";

import "bootstrap";

const Header: React.FC = () => {
  const [wichMenu, setWichMenu] = React.useState<string>("");
  React.useEffect(() => {
    const currentMenu = window.location.pathname;
    switch (currentMenu) {
      case "/":
        setWichMenu("Home");
        break;
      case "/browse":
        setWichMenu("Browse");
        break;
      case "/add":
        setWichMenu("Add");
        break;
      case "/stats":
        setWichMenu("Statistics");
    }
  }, []);

  const handeLogout = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="./logos/G&B_dark-transp-circle.png" alt="logo" width="55" />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <a
                aria-current="page"
                href="/"
                className={wichMenu === "Home" ? "nav-link active" : "nav-link"}
              >
                Home
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/browse"
                className={
                  wichMenu === "Browse" ? "nav-link active" : "nav-link"
                }
              >
                Browse
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/add"
                className={wichMenu === "Add" ? "nav-link active" : "nav-link"}
              >
                Add
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/stats"
                className={
                  wichMenu === "Statistics" ? "nav-link active" : "nav-link"
                }
              >
                Statistics
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/wishlist"
                className={
                  wichMenu === "Wishlist" ? "nav-link active" : "nav-link"
                }
              >
                Wishlist
              </a>
            </li>
          </ul>
          <form className="d-flex" onSubmit={handeLogout}>
            <button className="btn btn-outline-danger" type="submit">
              Logout
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Header;
