import { Component } from "react";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "./Ajouter.css";

import Login from "./Login";
import { isConnected } from "../middlewares/auth";

interface HomeState {
  isUserConnected: boolean | null;
}

const validate = () => {
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (form instanceof HTMLFormElement) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
};

class Ajouter extends Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isUserConnected: null,
    };
  }

  async componentDidMount() {
    try {
      const connected = (await isConnected()) as boolean;
      this.setState({ isUserConnected: connected });
      validate();
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  }

  render() {
    return (
      <>
        {this.state.isUserConnected === null ? (
          <p>Loading...</p>
        ) : this.state.isUserConnected ? (
          <div>
            <Header />
            <div className="container text-center mt-4">
              <h6 className="display-6">Ajouter des livres ✨</h6>
            </div>

            <div
              className="container mt-4 d-flex justify-content-center align-items-center"
              id="add-book-form"
            >
              <form className="row g-3 needs-validation" noValidate>
                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      📗
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      placeholder="Title"
                      aria-label="Title"
                      required
                    ></input>
                    <div className="invalid-feedback">
                      Please provide a title.
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-group mb-1">
                    <span className="input-group-text">🖊️ Author</span>
                    <input
                      type="text"
                      aria-label="First name"
                      className="form-control"
                      placeholder="First name"
                    ></input>
                    <input
                      type="text"
                      aria-label="Last name"
                      className="form-control"
                      placeholder="Last name"
                      required
                    ></input>
                    <div className="invalid-feedback">
                      Please provide a author name.
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      🗺️ Langue
                    </span>
                    <select className="form-select" id="lang-select" required>
                      <option selected disabled value="">
                        Select a language
                      </option>
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Espagnol">Espagnol</option>
                      <option value="Allemand">Allemand</option>
                      <option value="Japonais">Japonais</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <div className="invalid-feedback">
                      Please provide a language.
                    </div>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      Pages
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="pages"
                      placeholder="Pages"
                    ></input>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      Width (cm)
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="width"
                      placeholder="Width"
                    ></input>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      Height (cm)
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="height"
                      placeholder="Height"
                    ></input>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      📆 Publication Year
                    </span>
                    <input
                      type="date"
                      className="form-control"
                      id="publication-year"
                      placeholder="Year"
                    ></input>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      🗺️
                    </span>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="origin-country"
                      required
                    >
                      <option selected disabled value="">
                        Country of origin
                      </option>
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Espagnol">Espagnol</option>
                      <option value="Allemand">Allemand</option>
                      <option value="Japonais">Japonais</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <div className="invalid-feedback">
                      Please provide a country.
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      🔖 Type
                    </span>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="type-select"
                      required
                    >
                      <option selected disabled value="">
                        Book type
                      </option>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Poésie">Poésie</option>
                      <option value="Essai">Essai</option>
                      <option value="Beau Livre">Beau Livre</option>
                      <option value="Théâtre">Théâtre</option>
                      <option value="Comics">Comics</option>
                    </select>
                    <div className="invalid-feedback">
                      Please provide a type.
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      📖 Genre
                    </span>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="genre-select"
                    >
                      <option selected disabled value="">
                        Book genre
                      </option>
                      <option value="Science-Fiction">Science-Fiction</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Contemporain">Contemporain</option>
                      <option value="Historique">Historique</option>
                      <option value="Manga">Manga</option>
                      <option value="Recettes">Recettes</option>
                      <option value="Biographie">Biographie</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-12">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label"
                  >
                    Notes
                  </label>
                  <textarea
                    className="form-control"
                    id="notes"
                    rows={3}
                  ></textarea>
                </div>

                <div className="col-md-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="physical"
                      defaultChecked
                    ></input>
                    <label className="form-check-label" htmlFor="physical">
                      Physical
                    </label>
                  </div>
                </div>

                <div className="col-md-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="read"
                      defaultChecked
                    ></input>
                    <label className="form-check-label" htmlFor="read">
                      Read
                    </label>
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="want-read"
                    ></input>
                    <label className="form-check-label" htmlFor="want-read">
                      Want to read
                    </label>
                  </div>
                </div>

                <div className="col ">
                  <div className="container d-grid col-4">
                    <button type="submit" className="btn btn-info">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <Login />
        )}
      </>
    );
  }
}

export default Ajouter;
