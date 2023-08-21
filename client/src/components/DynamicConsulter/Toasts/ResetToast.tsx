import React from "react";

import "bootstrap";
import { Toast, ToastContainer } from "react-bootstrap";

interface ResetToastProps {
  showToast: boolean;
  setShowToastReset: React.Dispatch<React.SetStateAction<boolean>>;
}

const ResetToast: React.FC<ResetToastProps> = ({
  showToast,
  setShowToastReset,
}) => {
  return (
    <ToastContainer className="p-3" position="bottom-end" style={{ zIndex: 1 }}>
      <Toast show={showToast} onClose={() => setShowToastReset(false)}>
        <Toast.Header>
          <img
            src="./logos/G&B_dark-transp-circle.png"
            className="rounded me-2"
            style={{ width: "20px" }}
            alt="..."
          ></img>
          <strong className="me-auto">Glitch & Books</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>
          <strong>Reset</strong> effectué avec succès !
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ResetToast;
