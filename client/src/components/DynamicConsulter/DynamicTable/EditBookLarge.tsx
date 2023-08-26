import React, { useState, useEffect } from "react";

import { Book } from "../../../models/Book";
import Resources from "../../../middlewares/Resources";
import FormEdit from "../FormEdit";
import { Button, Modal } from "react-bootstrap";

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

export default EditBookLarge;
