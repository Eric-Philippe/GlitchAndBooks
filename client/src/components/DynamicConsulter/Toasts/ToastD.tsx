import React from "react";

import "bootstrap";
import { Toast, ToastContainer } from "react-bootstrap";

interface ToastDProps {
  show: boolean;
  setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
  body: string;
}

const ToastD: React.FC<ToastDProps> = ({ show, setShowToast, body }) => {
  return (
    <ToastContainer className="p-3" position="bottom-end">
      <Toast show={show} onClose={() => setShowToast(false)}>
        <Toast.Header>
          <img
            src="./logos/G&B_dark-transp-circle.png"
            className="rounded me-2"
            style={{ width: "20px" }}
            alt="G&B Logo"
          ></img>
          <strong className="me-auto">Glitch & Books</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>{body}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastD;
