import React, { useRef } from "react";

import "bootstrap";
import { Book } from "../../../models/Book";
import { Column, columnsHasField } from "../utils/DefaultColumns";
import { bookFieldToText } from "../utils/utils";
import EditBookSmall from "./EditBookSmall";
import Resources from "../../../middlewares/Resources";
import NoteModal from "../../NoteModal";

interface DynamicCardProps {
  book: Book;
  currentColumns: Column[];
  resources: Resources;
  whenLongPress: (bookId: number | undefined) => void;
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  book,
  currentColumns,
  resources,
  whenLongPress,
}) => {
  const [showEdit, setShowEdit] = React.useState<boolean>(false);
  const [showNotes, setShowNotes] = React.useState<boolean>(false);

  const timerRefLongPress = useRef<NodeJS.Timeout>();
  const timerRefDoubleClick = useRef<NodeJS.Timeout>();

  const isLongPress = useRef<boolean>();
  const isEarlySingleClick = useRef<boolean>(false);

  function touchPressMade() {
    isLongPress.current = false;
    timerRefLongPress.current = setTimeout(() => {
      isLongPress.current = true;
      setShowEdit(true);
    }, 1000);
  }

  function handleDoubleTap() {
    if (isEarlySingleClick.current) {
      setShowNotes(true);
      isEarlySingleClick.current = false;
    } else {
      isEarlySingleClick.current = true;
      setTimeout(() => {
        isEarlySingleClick.current = false;
      }, 250);
    }
  }

  return (
    <>
      {showNotes && <NoteModal book={book} setShow={setShowNotes}></NoteModal>}
      {showEdit && !showNotes && (
        <EditBookSmall
          book={book}
          setShow={setShowEdit}
          ressources={resources}
        ></EditBookSmall>
      )}
      <button
        className="list-group-item list-group-item-action"
        aria-current="true"
        onTouchStart={() => {
          touchPressMade();
          handleDoubleTap();
        }}
        onTouchEnd={() => {
          clearTimeout(timerRefLongPress.current);
          clearTimeout(timerRefDoubleClick.current);
        }}
        key={book.bookId}
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
    </>
  );
};

export default DynamicCard;
