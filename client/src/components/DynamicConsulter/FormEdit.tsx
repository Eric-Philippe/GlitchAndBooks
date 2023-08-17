import React, { useState } from "react";

import "bootstrap";
import { Book } from "../../models/Book";
import Resources from "../../middlewares/Resources";

const NUMBER_EMOTES = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];

interface EditBookProps {
  book: Book;
  ressources: Resources;
}

const FormEdit: React.FC<EditBookProps> = ({ book, ressources }) => {
  const [editedBook, setEditedBook] = useState<Book>(book);

  return (
    <form className="row g-3 needs-validation" noValidate>
      <div className="input-group">
        <span className="input-group-text" id="basic-addon1">
          📗
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          aria-label="Title"
          aria-describedby="basic-addon1"
          value={editedBook.title}
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
                  placeholder="Lastname"
                  aria-label="Lastname"
                  aria-describedby="basic-addon1"
                  value={editedBook.lastname[index]}
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
          placeholder="Pages"
          aria-label="Pages"
          aria-describedby="basic-addon1"
          value={editedBook.pages || "N/A"}
          onChange={(e) => {
            setEditedBook({
              ...editedBook,
              pages: parseInt(e.target.value),
            });
          }}
        />
      </div>
    </form>
  );
};

export default FormEdit;
