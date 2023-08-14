import { Component } from "react";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css";
import "./Ajouter.css";

import Login from "./Login";
import { isConnected } from "../middlewares/auth";
import Loading from "../components/Loading";
import { Book } from "../models/Book";
import { Toast } from "bootstrap";

interface HomeState {
  isUserConnected: boolean | null;
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

  constructor(props: {}) {
    super(props);
    this.state = {
      isUserConnected: null,
    };
  }

  public addAuthor = (e: React.FormEvent | MouseEvent) => {
    e.preventDefault();

    const authorsDiv = document.getElementById("authors") as HTMLDivElement;

    const authorForm = document.createElement("div");
    authorForm.className = "col-md-12 author-form";

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-group mb-1";

    const inputGroupText = document.createElement("span");
    inputGroupText.className = "input-group-text";
    inputGroupText.textContent = "🖊️ Author " + this.authorCount;

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
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {
      this.authorCount--;
      authorForm.remove();
      this.updateAddButtonStatus();
    });

    const addButton = document.createElement("button");
    addButton.className = "btn btn-outline-primary";
    addButton.type = "button";
    addButton.textContent = "Add author";
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
      this.setState({ isUserConnected: connected });
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

      let firstnameValue = firstname ? firstname.value : "";
      let lastnameValue = lastname ? lastname.value : "";

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

  async createBook(e: React.FormEvent) {
    e.preventDefault();
    const title = document.getElementById("title") as HTMLInputElement;
    const lang = document.getElementById("lang-select") as HTMLInputElement;
    const pages = document.getElementById("pages") as HTMLInputElement;
    const width = document.getElementById("width") as HTMLInputElement;
    const height = document.getElementById("height") as HTMLInputElement;
    const publicationYear = document.getElementById(
      "publication-year"
    ) as HTMLInputElement;
    const originCountry = document.getElementById(
      "origin-country"
    ) as HTMLInputElement;
    const type = document.getElementById("type-select") as HTMLInputElement;
    const notes = document.getElementById("notes") as HTMLInputElement;
    const physical = document.getElementById("physical") as HTMLInputElement;
    const read = document.getElementById("read") as HTMLInputElement;
    const wantRead = document.getElementById("want-read") as HTMLInputElement;

    const authorsCount = document.querySelectorAll(".author-form").length;
    const { firstname, lastname } = Ajouter.buildAuthors(authorsCount);
    const genre = Ajouter.buildGenres();

    const book: Book = {
      title: title.value,
      firstname: firstname,
      lastname: lastname,
      lang: lang.value,
      pages: pages ? parseInt(pages.value) : null,
      width: width ? parseInt(width.value) : null,
      height: height ? parseInt(height.value) : null,
      publicationYear: publicationYear ? parseInt(publicationYear.value) : null,
      originCountry: originCountry.value,
      type: type.value,
      genres: genre,
      notes: notes ? notes.value : null,
      physical: physical.checked,
      read: read.checked,
      wantRead: wantRead.checked,
    };

    if (book.title === "" || book.title == null) return;
    const bodyData = { book: book, userid: localStorage.getItem("userid") };
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:3005/api/v1/books/add", {
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
        {this.state.isUserConnected === null ? (
          <Loading />
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
              <form
                className="row g-3 needs-validation"
                noValidate
                onSubmit={this.createBook}
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
                        Add author
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
                      🗺️ Langue
                    </span>
                    <select className="form-select" id="lang-select" required>
                      <option selected disabled value="">
                        Select a language
                      </option>
                      <option value="Français">Français</option>
                      <option value="Anglais">Anglais</option>
                      <option value="Japonais">Japonais</option>
                      <option value="Allemand">Allemand</option>
                      <option value="Espagnol">Espagnol</option>
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
                      type="number"
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
                      <option value="France">France</option>
                      <option value="Angleterre">Angleterre</option>
                      <option value="Russie">Russie</option>
                      <option value="États-Unis">États-Unis</option>
                      <option value="Chine">Chine</option>
                      <option value="Islande">Islande</option>
                      <option value="Italie">Italie</option>
                      <option value="Autre">Autre</option>
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
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Poésie">Poésie</option>
                      <option value="Théâtre">Théâtre</option>
                      <option value="Beau Livre">Beau Livre</option>
                      <option value="Comics">Comics</option>
                      <option value="Manga">Manga</option>
                      <option value="Essai">Essai</option>
                    </select>
                    <div className="invalid-feedback">
                      Please provide a type.
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="input-group">
                    <span className="input-group-text" id="basic-addon1">
                      📖 Genre
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
                      <option value="Science-Fiction">Science-Fiction</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Young-Adult">Young-Adult</option>
                      <option value="Historique">Historique</option>
                      <option value="Biographie">Biographie</option>
                      <option value="Romance">Romance</option>
                      <option value="Contemporain">Contemporain</option>
                      <option value="Policier">Policier</option>
                      <option value="Recettes">Recettes</option>
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
