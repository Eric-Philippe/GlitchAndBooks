import React, { useState, useEffect } from "react";

import { Book } from "../../../models/Book";
import Resources from "../../../middlewares/Resources";
import FormEdit from "../FormEdit";
import { Modal } from "react-bootstrap";

interface EditBookProps {
  book: Book;
  setShowFromParent: React.Dispatch<React.SetStateAction<boolean>>;
  ressources: Resources;
}

const EditBookLarge: React.FC<EditBookProps> = ({
  book,
  ressources,
  setShowFromParent,
}) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    setShowFromParent(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    handleShow();
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editing: {book.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormEdit
          book={book}
          ressources={ressources}
          handeCloseParent={handleClose}
        />
      </Modal.Body>
    </Modal>
  );
};

export default EditBookLarge;
