import React from "react";

import "bootstrap";
import { Book } from "../../../models/Book";
import { Column, columnsHasField } from "../utils/DefaultColumns";

interface DynamicCardProps {
  book: Book;
  currentColumns: Column[];
}

const bookFieldToText = (book: Book, field: string) => {
  if (field === "authors") {
    const firstnames = book["firstname"] as string[];
    const lastnames = book["lastname"] as string[];
    const authors = firstnames.map((firstname, index) => {
      let first = firstname != null ? firstname : "";
      return first + " " + lastnames[index];
    });

    return authors.join(", ");
  }

  const value = book[field];

  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return value.toString();
    case "boolean":
      return value ? "✅" : "❌";
    case "undefined":
      return "non défini";
    case "object":
      if (value === null) {
        return "N/A";
      }
      break;
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  return "";
};

const DynamicCard: React.FC<DynamicCardProps> = ({ book, currentColumns }) => {
  return (
    <button
      className="list-group-item list-group-item-action"
      aria-current="true"
    >
      <div className="d-flex w-100 justify-content-between">
        {columnsHasField(currentColumns, "title") ? (
          <h5 className="mb-1">{book.title}</h5>
        ) : null}
        {columnsHasField(currentColumns, "publicationYear") ? (
          <small>
            <i>{book.publicationYear}</i>
          </small>
        ) : null}
        {columnsHasField(currentColumns, "pages") ? (
          <small> ​ ​ ​ ​ {book.pages ? book.pages : "N/A"} pages</small>
        ) : null}
      </div>
      {columnsHasField(currentColumns, "authors") ? (
        <p className="mb-1">{bookFieldToText(book, "authors")}</p>
      ) : null}
      {columnsHasField(currentColumns, "lang") ? (
        <small>
          <strong>Languages</strong>: {bookFieldToText(book, "lang")} <br />
        </small>
      ) : null}
      {columnsHasField(currentColumns, "type") ? (
        <small>
          <strong>Type</strong>: {bookFieldToText(book, "type")} <br />
        </small>
      ) : null}
      {columnsHasField(currentColumns, "genres") ? (
        <small>
          <strong>Genre(s)</strong>: {bookFieldToText(book, "genres")} <br />
        </small>
      ) : null}
      {columnsHasField(currentColumns, "originCountry") ? (
        <small>
          <strong>Country of Origin</strong>:{" "}
          {bookFieldToText(book, "originCountry")} <br />
        </small>
      ) : null}
      {columnsHasField(currentColumns, "height") ||
      columnsHasField(currentColumns, "width") ? (
        <div>
          <br></br>
          <br></br>
        </div>
      ) : null}
      {columnsHasField(currentColumns, "height") ? (
        <small>
          <strong>
            <i>Height</i>
          </strong>
          : {bookFieldToText(book, "height")} cm <br />
        </small>
      ) : null}
      {columnsHasField(currentColumns, "width") ? (
        <small>
          <strong>
            <i>Width</i>
          </strong>
          : {bookFieldToText(book, "width")} cm <br />
          <br />
        </small>
      ) : null}
      {columnsHasField(currentColumns, "physical") ? (
        <small>
          {" "}
          <strong>
            <i>Physical</i>
          </strong>
          : {book.physical ? "✅" : "❌"}
        </small>
      ) : null}
      {columnsHasField(currentColumns, "read") ? (
        <small>
          {" "}
          <strong>
            <i>Read</i>
          </strong>
          : {book.read ? "✅" : "❌"}
        </small>
      ) : null}
      {columnsHasField(currentColumns, "wantRead") ? (
        <small>
          {" "}
          <strong>
            <i>Want to Read</i>
          </strong>
          : {book.wantRead ? "✅" : "❌"}
        </small>
      ) : null}
    </button>
  );
};

export default DynamicCard;
