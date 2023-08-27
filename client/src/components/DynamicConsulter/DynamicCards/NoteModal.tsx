import React, { useState, useEffect } from "react";
import "bootstrap";
import { Book } from "../../../models/Book";

interface EditBookProps {
  book: Book;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

const NoteModal: React.FC<EditBookProps> = ({ book, setShow }) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  useEffect(() => {
    setIsFullScreen(true);
    document.body.style.overflow = "hidden";

    return () => {
      setIsFullScreen(false);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className={`modal fade ${isFullScreen ? "show" : ""}`}
      id="modalNotes"
      tabIndex={999}
      aria-labelledby="modalNotes"
      style={{ display: isFullScreen ? "block" : "none" }}
      aria-modal="true"
      role="dialog"
    >
      <div className="modal-dialog modal-fullscreen">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-4" id="modalNotes">
              Notes: {book.title}
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                setShow(false);
              }}
            ></button>
          </div>

          <div
            className="modal-body"
            style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          >
            {book.notes ? book.notes : <i>No notes for this book !</i>}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteModal;
