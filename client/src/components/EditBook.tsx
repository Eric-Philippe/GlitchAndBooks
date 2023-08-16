import React, { useState } from "react";
import "bootstrap";
import { Book } from "../models/Book";
import Resources from "../middlewares/Resources";
import { bookEquals, createBook } from "../utils/BooksUtils";

const NUMBER_EMOTES = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface EditBookProps {
  book: Book | undefined;
  ressources: Resources;
}

const EditBook: React.FC<EditBookProps> = ({ book, ressources }) => {
  const [isBookLoaded, setIsBookLoaded] = useState(false);
  const [title, setTitle] = useState(isBookLoaded ? book!.title : "");
  const [authors, setAuthors] = useState(isBookLoaded ? book!.lastname : []);
  const [isPhysicalChecked, setIsPhysicalChecked] = useState(
    isBookLoaded ? book!.physical : false
  );
  const [isReadChecked, setIsReadChecked] = useState(
    isBookLoaded ? book!.read : false
  );
  const [isWantReadChecked, setIsWantReadChecked] = useState(
    isBookLoaded ? book!.wantRead : false
  );

  if (book != undefined && !isBookLoaded) {
    setIsBookLoaded(true);
  }

  const handleAuthorFirstNameChange = (value: string, index: number) => {
    const updatedAuthors = [...authors];
    updatedAuthors[index] = value;
    setAuthors(updatedAuthors);
  };

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
    }, 1500);
  };

  const createEditedBook = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const newBook = createBook();

    if (!book) return;

    console.log("book", book);
    console.log("newBook", newBook);

    console.log(bookEquals(newBook, book));
  };

  const handleCloseModal = () => {
    setTitle("");
    setAuthors([]);
    setIsPhysicalChecked(false);
    setIsReadChecked(false);
    setIsWantReadChecked(false);
    setIsBookLoaded(false);

    book = undefined;
    const forms = document.querySelectorAll(".needs-validation");
    Array.from(forms).forEach((form) => {
      form.classList.remove("was-validated");
    });
  };

  return (
    <div
      className="modal fade"
      id="exampleModalFullscreen"
      tabIndex={-1}
      aria-labelledby="exampleModalFullscreenLabel"
      style={{ display: "none" }}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-4" id="exampleModalFullscreenLabel">
              {book != undefined ? `Edit - ${book!.title}` : "Loading..."}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            <div
              className="container mt-4 d-flex justify-content-center align-items-center"
              id="center-container"
            >
              <form
                className="row g-3 needs-validation"
                noValidate
                onSubmit={createEditedBook}
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      aria-label="Title"
                      required
                    />
                    <div className="invalid-feedback">
                      Please provide a title.
                    </div>
                  </div>
                </div>
                <div id="authors">
                  {isBookLoaded
                    ? book!.lastname.map((lastname, index) => (
                        <div className="col-md-12 author-form" key={index}>
                          <div className="input-group mb-1">
                            <span className="input-group-text">
                              {NUMBER_EMOTES[index]} Author
                            </span>
                            <input
                              type="text"
                              aria-label="First name"
                              className="form-control"
                              placeholder="First name"
                              id={`firstname_${index}`}
                              value={book!.firstname[index] || ""}
                              onChange={(e) =>
                                handleAuthorFirstNameChange(
                                  e.target.value,
                                  index
                                )
                              }
                            />
                            <input
                              type="text"
                              aria-label="Last name"
                              className="form-control"
                              placeholder="Last name"
                              id={`lastname_${index}`}
                              required
                              value={lastname}
                              onChange={(e) => {
                                const updatedAuthors = [...authors];
                                updatedAuthors[index] = e.target.value;
                                setAuthors(updatedAuthors);
                              }}
                            />
                            <div className="invalid-feedback">
                              Please provide an author name.
                            </div>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
                <div className="col-md-12">
                  <div className="input-group mb-1">
                    <span className="input-group-text" id="basic-addon1">
                      🗺️ Langue
                    </span>
                    <select className="form-select" id="lang-select" required>
                      <option disabled>Select a language</option>
                      {ressources.getLanguages().map((lang) => (
                        <option
                          value={lang}
                          key={lang}
                          selected={book && lang === book!.lang}
                        >
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
                      defaultValue={
                        isBookLoaded && book!.pages !== null ? book!.pages : ""
                      }
                    />
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
                      defaultValue={
                        isBookLoaded && book!.publicationYear !== null
                          ? book!.publicationYear
                          : ""
                      }
                    />
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
                      defaultValue={
                        isBookLoaded && book!.width !== null ? book!.width : ""
                      }
                    />
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
                      defaultValue={
                        isBookLoaded && book!.height !== null
                          ? book!.height
                          : ""
                      }
                    />
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
                      <option disabled>Country of origin</option>
                      {ressources.getCountries().map((country) => (
                        <option
                          value={country}
                          key={country}
                          selected={book?.originCountry == country}
                        >
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
                      <option disabled defaultValue="">
                        Book type
                      </option>
                      {ressources.getTypes().map((type) => (
                        <option
                          defaultValue={type}
                          key={type}
                          selected={book?.type == type}
                        >
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
                      📖 Genre
                    </span>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      id="genre-select"
                      multiple
                      defaultValue={
                        isBookLoaded && book!.genres ? book!.genres : []
                      }
                    >
                      <option disabled defaultValue="">
                        Book genre
                      </option>
                      {ressources.getGenres().map((genre) => (
                        <option
                          defaultValue={genre}
                          key={genre}
                          selected={book?.genres?.includes(genre)}
                        >
                          {genre}
                        </option>
                      ))}
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
                    defaultValue={book ? book!.notes || "" : ""}
                  ></textarea>
                </div>
                <div className="col-md-2">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="physical"
                      checked={isPhysicalChecked}
                      onChange={() => setIsPhysicalChecked(!isPhysicalChecked)}
                    />
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
                      checked={isReadChecked}
                      onChange={() => setIsReadChecked(!isReadChecked)}
                    />
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
                      checked={isWantReadChecked}
                      onChange={() => setIsWantReadChecked(!isWantReadChecked)}
                    />
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
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBook;
