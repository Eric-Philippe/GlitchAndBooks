import React, { useRef } from "react";

import Resources from "../../../middlewares/Resources";
import { Book } from "../../../models/Book";
import { Column, columnsHasField } from "../utils/DefaultColumns";
import { bookFieldToText } from "../utils/utils";
import NoteModal from "../../NoteModal";
import FormEdit from "../FormEdit";

interface DynamicCardProps {
  book: Book;
  currentColumns: Column[];
  resources: Resources;
  removeBook: (bookId: number) => void;
  setNewEvent: React.Dispatch<React.SetStateAction<string[]>>;
  newEvents: string[];
}

const DynamicCard: React.FC<DynamicCardProps> = ({
  book,
  currentColumns,
  resources,
  removeBook,
  setNewEvent,
  newEvents,
}) => {
  const [showEdit, setShowEdit] = React.useState<boolean>(false);
  const [showNotes, setShowNotes] = React.useState<boolean>(false);

  const timerRefLongPress = useRef<NodeJS.Timeout>();
  const timerRefDoubleClick = useRef<NodeJS.Timeout>();

  const isLongPress = useRef<boolean>(false);
  const isEarlySingleClick = useRef<boolean>(false);

  function touchPressMade() {
    isLongPress.current = false;
    timerRefLongPress.current = setTimeout(() => {
      isLongPress.current = true;

      setShowEdit(true);
      setShowNotes(false);
    }, 1000);
  }

  function handleDoubleTap() {
    if (isEarlySingleClick.current) {
      setShowEdit(false);
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
        <FormEdit
          book={book}
          mainModalInBackground={true}
          ressources={resources}
          setShowMainModalOuter={setShowEdit}
          showMainModalOuter={showEdit}
          removeBookFromList={removeBook}
          setNewEventToToast={setNewEvent}
          currentToasts={newEvents}
        />
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
