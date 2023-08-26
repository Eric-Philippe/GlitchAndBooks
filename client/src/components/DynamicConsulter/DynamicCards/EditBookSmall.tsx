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

const EditBookSmall: React.FC<EditBookProps> = ({
  book,
  ressources,
  setShowFromParent,
}) => {
  const [show, setShow] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleClose = () => {
    setShow(false);
    setShowFromParent(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    handleShow();
  }, []);

  return <></>;
};

export default EditBookSmall;
