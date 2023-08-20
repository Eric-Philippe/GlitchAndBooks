import React, { useState } from "react";

import "bootstrap";
import { Book } from "../../models/Book";
import Resources from "../../middlewares/Resources";
import { bookEquals } from "../../utils/BooksUtils";

const NUMBER_EMOTES = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface EditBookProps {
  book: Book;
  ressources: Resources;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormEdit: React.FC<EditBookProps> = ({ book, ressources, setShow }) => {
  const originBook = book;
  const [editedBook, setEditedBook] = useState<Book>(book);

  const editBook = (e: React.FormEvent | MouseEvent) => {
    e.preventDefault();
    console.log("Original Book Name: " + originBook.title);

    console.log(bookEquals(originBook, editedBook));
    console.log(originBook.bookId);
  };

  return (
    <form
      className="row g-3 needs-validation"
      noValidate
      onSubmit={(e) => {
        editBook(e);
      }}
    >
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
          aria-describedby="basic-addon1"
          value={editedBook.title}
          required
          onChange={(e) => {
            setEditedBook({ ...editedBook, title: e.target.value });
          }}
        />
      </div>

      <div id="authors">
        <div className="col-md-12 author-form">
          {book.lastname.map((lastname, index) => {
            return (
              <div className="input-group" key={index}>
                <span className="input-group-text" id="basic-addon1">
                  {NUMBER_EMOTES[index]}
                </span>
                <input
                  type="text"
                  className="form-control"
                  id={"lastname-" + index}
                  placeholder="Lastname"
                  aria-label="Lastname"
                  aria-describedby="basic-addon1"
                  value={editedBook.lastname[index]}
                  required
                  onChange={(e) => {
                    const newLastname = [...editedBook.lastname];
                    newLastname[index] = e.target.value;
                    setEditedBook({
                      ...editedBook,
                      lastname: newLastname,
                    });
                  }}
                />
                <input
                  type="text"
                  className="form-control"
                  id={"firstname-" + index}
                  placeholder="Firstname"
                  aria-label="Firstname"
                  aria-describedby="basic-addon1"
                  value={editedBook.firstname[index]}
                  onChange={(e) => {
                    const newFirstname = [...editedBook.firstname];
                    newFirstname[index] = e.target.value;
                    setEditedBook({
                      ...editedBook,
                      firstname: newFirstname,
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/** Language Select */}
      <div className="input-group">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          🌐
        </label>
        <select
          className="form-select"
          id="inputGroupSelect01"
          value={editedBook.lang}
          required
          onChange={(e) => {
            setEditedBook({ ...editedBook, lang: e.target.value });
          }}
        >
          {ressources.getLanguages().map((lang) => {
            return (
              <option key={lang} value={lang}>
                {lang}
              </option>
            );
          })}
        </select>
      </div>

      {/** Pages */}
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          📄
        </span>
        <input
          type="number"
          className="form-control"
          id="pages"
          placeholder="Pages"
          aria-label="Pages"
          aria-describedby="basic-addon1"
          value={editedBook.pages || ""}
          onChange={(e) => {
            setEditedBook({
              ...editedBook,
              pages: parseInt(e.target.value),
            });
          }}
        />
      </div>

      {/** Publication Year */}
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          📅
        </span>
        <input
          type="number"
          className="form-control"
          id="publicationYear"
          placeholder="Publication Year"
          aria-label="Publication Year"
          aria-describedby="basic-addon1"
          value={editedBook.publicationYear || ""}
          onChange={(e) => {
            setEditedBook({
              ...editedBook,
              publicationYear: parseInt(e.target.value),
            });
          }}
        />
      </div>

      {/** Height */}
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          Height 📏
        </span>
        <input
          type="number"
          className="form-control"
          id="height"
          placeholder="Height"
          aria-label="Height"
          aria-describedby="basic-addon1"
          value={editedBook.height || ""}
          onChange={(e) => {
            setEditedBook({
              ...editedBook,
              height: parseInt(e.target.value),
            });
          }}
        />
      </div>

      {/** Width */}
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          Width 📏
        </span>
        <input
          type="number"
          className="form-control"
          id="width"
          placeholder="Width"
          aria-label="Width"
          aria-describedby="basic-addon1"
          value={editedBook.width || ""}
          onChange={(e) => {
            setEditedBook({
              ...editedBook,
              width: parseInt(e.target.value),
            });
          }}
        />
      </div>

      {/** Country of Origin */}
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          🗺️
        </span>
        <select
          className="form-select"
          aria-label="Country of Origin"
          id="countryOfOrigin"
          required
          defaultValue={editedBook.originCountry}
          onChange={(e) => {
            setEditedBook({ ...editedBook, originCountry: e.target.value });
          }}
        >
          {ressources.getCountries().map((country) => {
            return (
              <option key={country} value={country}>
                {country}
              </option>
            );
          })}
        </select>
      </div>

      {/** Type */}
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          🔖
        </span>
        <select
          className="form-select"
          aria-label="Country of Origin"
          id="type"
          required
          defaultValue={editedBook.type}
          onChange={(e) => {
            setEditedBook({ ...editedBook, type: e.target.value });
          }}
        >
          {ressources.getTypes().map((type) => {
            return (
              <option key={type} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>

      {/** Genres */}
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          📖
        </span>
        <select
          className="form-select"
          aria-label="Country of Origin"
          required
          multiple
          defaultValue={editedBook.genres || []}
          onChange={(e) => {
            const genres = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            setEditedBook({ ...editedBook, genres: genres });
          }}
        >
          {ressources.getGenres().map((genre) => {
            return (
              <option key={genre} value={genre}>
                {genre}
              </option>
            );
          })}
        </select>
      </div>

      <div className="col-md-12">
        <label htmlFor="notes" className="form-label">
          Notes
        </label>
        <textarea
          className="form-control"
          id="notes"
          rows={3}
          value={editedBook.notes || ""}
          onChange={(e) => {
            setEditedBook({ ...editedBook, notes: e.target.value });
          }}
        ></textarea>
      </div>

      <div className="col-md-4">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="physical"
            defaultChecked={editedBook.physical}
            onChange={(e) => {
              setEditedBook({ ...editedBook, physical: e.target.checked });
            }}
          ></input>
          <label className="form-check-label" htmlFor="physical">
            Physical
          </label>
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="read"
            defaultChecked={editedBook.read}
            onChange={(e) => {
              setEditedBook({ ...editedBook, read: e.target.checked });
            }}
          ></input>
          <label className="form-check-label" htmlFor="physical">
            Read
          </label>
        </div>
      </div>

      <div className="col-md-4">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="wantRead"
            defaultChecked={editedBook.wantRead}
            onChange={(e) => {
              setEditedBook({ ...editedBook, wantRead: e.target.checked });
            }}
          ></input>
          <label className="form-check-label" htmlFor="physical">
            Want to read
          </label>
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          data-bs-dismiss="modal"
          onClick={() => {
            setShow(false);
          }}
        >
          Close
        </button>
        <button type="button" className="btn btn-danger">
          Delete Book
        </button>
        <button type="submit" className="btn btn-primary">
          Save changes
        </button>
      </div>
    </form>
  );
};

export default FormEdit;
