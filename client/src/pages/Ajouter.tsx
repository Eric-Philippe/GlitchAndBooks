import { Component } from "react";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "./styles.css";

import Login from "./Login";
import { isConnected } from "../middlewares/auth";
import Loading from "../components/Loading";
import { Toast } from "bootstrap";

import Resources from "../middlewares/Resources";
import { createBook } from "../utils/BooksUtils";

const NUMBER_EMOTES = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface HomeState {
  isUserConnected: boolean | null;
  areResourcesLoaded: boolean | null;
}

const validate = () => {
  setTimeout(() => {
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
  }, 500);

  const toastTrigger = document.getElementById("liveToastBtn");
  const toastLiveExample = document.getElementById("liveToast") as HTMLElement;

  if (toastTrigger) {
    const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample);
    toastTrigger.addEventListener("click", () => {
      toastBootstrap.show();
    });
  }
};

class Ajouter extends Component<{}, HomeState> {
  public authorCount: number = 1;
  private ressources: Resources = Resources.getInstance();

  constructor(props: {}) {
    super(props);
    this.state = {
      isUserConnected: null,
      areResourcesLoaded: null,
    };
  }

  public addAuthor = (e: React.FormEvent | MouseEvent) => {
    e.preventDefault();

    if (this.authorCount >= NUMBER_EMOTES.length) return;

    const authorsDiv = document.getElementById("authors") as HTMLDivElement;

    const authorForm = document.createElement("div");
    authorForm.className = "col-md-12 author-form";

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group mb-1";

    const inputGroupText = document.createElement("span");
    inputGroupText.className = "input-group-text";
    inputGroupText.textContent =
      NUMBER_EMOTES[this.authorCount - 1] + "​​​​​​ ​​ ​Author ";

    const firstNameInput = document.createElement("input");
    firstNameInput.type = "text";
    firstNameInput.className = "form-control";
    firstNameInput.placeholder = "First name";
    firstNameInput.id = "firstname_" + this.authorCount;
    firstNameInput.setAttribute("aria-label", "First name");

    const lastNameInput = document.createElement("input");
    lastNameInput.type = "text";
    lastNameInput.className = "form-control";
    lastNameInput.placeholder = "Last name";
    lastNameInput.id = "lastname_" + this.authorCount;
    lastNameInput.setAttribute("aria-label", "Last name");
    lastNameInput.required = true;

    const removeButton = document.createElement("button");
    removeButton.className = "btn btn-outline-danger";
    removeButton.type = "button";
    removeButton.textContent = "🗑️";
    removeButton.addEventListener("click", () => {
      this.authorCount--;
      authorForm.remove();
      this.updateAddButtonStatus();
    });

    const addButton = document.createElement("button");
    addButton.className = "btn btn-outline-primary";
    addButton.type = "button";
    addButton.textContent = "➕";
    addButton.addEventListener("click", this.addAuthor);
    addButton.disabled = true;

    const invalidFeedback = document.createElement("div");
    invalidFeedback.className = "invalid-feedback";
    invalidFeedback.textContent = "Please provide an author name.";

    inputGroup.appendChild(inputGroupText);
    inputGroup.appendChild(firstNameInput);
    inputGroup.appendChild(lastNameInput);
    inputGroup.appendChild(removeButton); // Add the remove button
    inputGroup.appendChild(addButton);
    inputGroup.appendChild(invalidFeedback);
    authorForm.appendChild(inputGroup);

    authorsDiv.appendChild(authorForm);
    this.updateAddButtonStatus();
    this.authorCount++;
  };

  public updateAddButtonStatus = () => {
    const authorForms = document.querySelectorAll(".author-form");

    authorForms.forEach((authorForm, index) => {
      const addButtons = authorForm.querySelectorAll(
        ".btn-outline-primary"
      ) as NodeListOf<HTMLButtonElement>;

      addButtons.forEach((addButton) => {
        if (index === authorForms.length - 1) {
          addButton.disabled = false;
        } else {
          addButton.disabled = true;
        }
      });
    });

    authorForms.forEach((authorForm, index) => {
      const addButtons = authorForm.querySelectorAll(
        ".btn-outline-danger"
      ) as NodeListOf<HTMLButtonElement>;

      addButtons.forEach((addButton) => {
        if (index === authorForms.length - 1) {
          addButton.disabled = false;
        } else {
          addButton.disabled = true;
        }
      });
    });
  };

  async componentDidMount() {
    try {
      const connected = (await isConnected()) as boolean;
      if (!this.ressources.isReady()) await this.ressources.fill();

      this.setState({ isUserConnected: connected });
      this.setState({ areResourcesLoaded: true });
      validate();
    } catch (error) {
      console.error("Error checking connection status:", error);
    }
  }

  static buildAuthors(authorCount: number): {
    firstname: string[];
    lastname: string[];
  } {
    const authors: { firstname: string[]; lastname: string[] } = {
      firstname: [],
      lastname: [],
    };

    for (let i = 0; i < authorCount; i++) {
      const firstname = document.getElementById(
        "firstname_" + i
      ) as HTMLInputElement;
      const lastname = document.getElementById(
        "lastname_" + i
      ) as HTMLInputElement;

      let firstnameValue = firstname ? firstname.value.trim() : "";
      let lastnameValue = lastname ? lastname.value.trim() : "";

      authors.firstname.push(firstnameValue);
      authors.lastname.push(lastnameValue);
    }

    return authors;
  }

  static buildGenres(): string[] {
    const genres: string[] = [];

    const genre = document.getElementById("genre-select") as HTMLSelectElement;

    // Genre is a multiple select
    for (let i = 0; i < genre.selectedOptions.length; i++) {
      if (genre.selectedOptions[i].value !== "")
        genres.push(genre.selectedOptions[i].value);
    }

    return genres;
  }

  async loadBook(e: React.FormEvent) {
    e.preventDefault();

    const book = createBook();

    if (book.title === "" || book.title == null) return;
    const bodyData = { book: book, userid: localStorage.getItem("userid") };
    const token = localStorage.getItem("token");

    const res = await fetch(process.env.REACT_APP_API_URL + "/v1/books/add", {
      method: "POST",
      body: JSON.stringify(bodyData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 200) {
      // refresh page
      window.location.reload();
      const toastLiveExample = document.getElementById(
        "liveToast"
      ) as HTMLElement;
      const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample);
      toastBootstrap.show();
    } else {
      console.error("Error while adding book:", res);
    }
  }

  render() {
    return (
      <>
        {this.state.isUserConnected === null ||
        this.state.areResourcesLoaded === null ? (
          <Loading />
        ) : this.state.isUserConnected ? (
          <div>
            <Header />
            <div className="container text-center mt-4">
              <h6 className="display-6">Ajouter des livres ✨</h6>
            </div>

            <div
              className="container mt-4 d-flex justify-content-center align-items-center"
              id="center-container"
            >
              <form
                className="row g-3 needs-validation"
                noValidate
                onSubmit={this.loadBook}
              >
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

                <div id="authors">
                  <div className="col-md-12 author-form">
                    <div className="input-group mb-1">
                      <span className="input-group-text">🖊️ Author</span>
                      <input
                        type="text"
                        aria-label="First name"
                        className="form-control"
                        placeholder="First name"
                        id="firstname_0"
                      ></input>
                      <input
                        type="text"
                        aria-label="Last name"
                        className="form-control"
                        placeholder="Last name"
                        id="lastname_0"
                        required
                      ></input>
                      <button
                        className="btn btn-outline-primary"
                        type="button"
                        id="button-addon2"
                        onClick={this.addAuthor}
                      >
                        ➕
                      </button>

                      <div className="invalid-feedback">
                        Please provide an author name.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      🌐 Langue
                    </span>
                    <select className="form-select" id="lang-select" required>
                      <option selected disabled value="">
                        Select a language
                      </option>
                      {this.ressources.getLanguages().map((lang) => (
                        <option value={lang} key={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please provide a language.
                    </div>
                  </div>
                </div>

                <div className="col">
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

                <div className="col-md-4">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      Publication Year
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="publication-year"
                      placeholder="Year"
                    ></input>
                  </div>
                </div>

                <div className="col">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      Width
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="width"
                      placeholder="(cm)"
                    ></input>
                  </div>
                </div>

                <div className="col">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      Height
                    </span>
                    <input
                      type="number"
                      className="form-control"
                      id="height"
                      placeholder="(cm)"
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
                      {this.ressources.getCountries().map((country) => (
                        <option value={country} key={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please provide a country.
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
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
                      {this.ressources.getTypes().map((type) => (
                        <option value={type} key={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback">
                      Please provide a type.
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      📖 Genre(s)
                    </span>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="genre-select"
                      multiple
                    >
                      <option selected disabled value="">
                        Book genre
                      </option>
                      {this.ressources.getGenres().map((genre) => (
                        <option value={genre} key={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-12">
                  <label htmlFor="notes" className="form-label">
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

                <div className="col mb-4">
                  <div className="container d-grid col-4">
                    <button type="submit" className="btn btn-info">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="toast-container position-fixed bottom-0 end-0 p-3">
              <div
                id="liveToast"
                className="toast"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
              >
                <div className="toast-header">
                  <strong className="me-auto">Livre bien ajouté !</strong>
                  <small>Just now !</small>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="toast-body">
                  Le livre a bien été ajouté à votre bibliothèque !
                </div>
              </div>
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
