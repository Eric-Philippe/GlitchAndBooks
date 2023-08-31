import React from "react";

import "bootstrap";

const Header: React.FC = () => {
  const [wichMenu, setWichMenu] = React.useState<string>("");
  React.useEffect(() => {
    const currentMenu = window.location.pathname;
    switch (currentMenu) {
      case "/":
        setWichMenu("Accueil");
        break;
      case "/consulter":
        setWichMenu("Consulter");
        break;
      case "/ajouter":
        setWichMenu("Ajouter");
        break;
      case "/stats":
        setWichMenu("Statistiques");
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
                className={
                  wichMenu === "Accueil" ? "nav-link active" : "nav-link"
                }
              >
                Accueil
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/consulter"
                className={
                  wichMenu === "Consulter" ? "nav-link active" : "nav-link"
                }
              >
                Consulter
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/ajouter"
                className={
                  wichMenu === "Ajouter" ? "nav-link active" : "nav-link"
                }
              >
                Ajouter
              </a>
            </li>
            <li className="nav-item">
              <a
                href="/stats"
                className={
                  wichMenu === "Statistiques" ? "nav-link active" : "nav-link"
                }
              >
                Statistiques
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
