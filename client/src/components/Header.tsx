import React from "react";
import "bootstrap";
import { Button, Dropdown } from "react-bootstrap";
import { PersonCircle } from "react-bootstrap-icons";
import "./Header.css"; // Import du fichier CSS externe

const Header: React.FC = () => {
  const [wichMenu, setWichMenu] = React.useState<string>("");
  const isLargeScreen = window.innerWidth > 768;

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

  const handeLogout = () => {
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

          {/** Account menu */}
          <Dropdown>
            <Dropdown.Toggle
              variant="outline-primary"
              id="dropdown-basic"
              className="btn btn-outline-primary"
            >
              <PersonCircle /> Account ({localStorage.getItem("username")})
            </Dropdown.Toggle>

            <Dropdown.Menu className="account-menu">
              <div className="d-flex flex-column align-items-center">
                <p className="small">{localStorage.getItem("mail")}</p>
                <Button
                  variant="outline-light"
                  className="mb-2 account-btn"
                  type="submit"
                  onClick={() => {
                    window.location.href = "/account";
                  }}
                >
                  Account settings
                </Button>
                <Button
                  variant="outline-danger"
                  className="mb-2 account-btn"
                  type="submit"
                  onClick={handeLogout}
                >
                  Logout
                </Button>
                <hr className="w-100" />
                <div className="d-flex justify-content-between">
                  <span
                    className="px-1 text-decoration-none clickable-text"
                    id="about-link"
                  >
                    About
                  </span>
                  <span className=""> • </span>
                  <span
                    className="px-1 text-decoration-none clickable-text"
                    id="help-link"
                  >
                    Help
                  </span>
                </div>{" "}
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Header;
