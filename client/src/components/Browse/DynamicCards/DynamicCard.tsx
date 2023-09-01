import React, { useRef } from "react";

import { Column, columnsHasField } from "../utils/DefaultColumns";
import { bookFieldToText } from "../utils/utils";
import { Book } from "../../../models/Book";

import Resources from "../../../middlewares/Resources";
import NoteModal from "./NoteModal";
import FormEdit from "../FormEdit";

/**
 * DynamicCard component props Interface
 * @interface
 * @property {Book} book - Book to display
 * @property {Column[]} currentColumns - Properties to display
 * @property {Resources} resources - Resources to display
 * @property {Function} removeBook - Function to remove a book from the list
 * @property {Function} editBook - Function to edit a book from the list
 * @property {Function} setNewEvent - Function to set a new event to the toast
 * @property {string[]} newEvents - List of events to display in the toast *
 */
interface DynamicCardProps {
  book: Book;
  currentColumns: Column[];
  resources: Resources;
  removeBook: (bookId: number) => void;
  editBook: (book: Book) => void;
  setNewEvent: React.Dispatch<React.SetStateAction<string[]>>;
  newEvents: string[];
}

/**
 * DynamicCard component for a single book
 * @component
 * @param {DynamicCardProps} props - Component props
 * @returns
 */
const DynamicCard: React.FC<DynamicCardProps> = ({
  book,
  currentColumns,
  resources,
  removeBook,
  editBook,
  setNewEvent,
  newEvents,
}) => {
  /** @MODAL_SHOW_STATES */
  const [showEdit, setShowEdit] = React.useState<boolean>(false);
  const [showNotes, setShowNotes] = React.useState<boolean>(false);

  /** @LONG_PRESS_DETECTOR */
  const timerRefLongPress = useRef<NodeJS.Timeout>();
  const isLongPress = useRef<boolean>(false);

  /** @DOUBLE_CLICK_DETECTOR */
  const timerRefDoubleClick = useRef<NodeJS.Timeout>();
  const isEarlySingleClick = useRef<boolean>(false);

  /**
   * Function to handle long press
   * @function
   * @returns {void}
   */
  function handLongPress() {
    isLongPress.current = false;
    timerRefLongPress.current = setTimeout(() => {
      isLongPress.current = true;

      setShowEdit(true);
      setShowNotes(false);
    }, 1000);
  }

  /**
   * Function to handle double click
   * @function
   * @returns {void}
   */
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
          editBookInList={editBook}
          setNewEventToToast={setNewEvent}
          currentToasts={newEvents}
        />
      )}
      <button
        className="list-group-item list-group-item-action"
        aria-current="true"
        onTouchStart={() => {
          handLongPress();
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
