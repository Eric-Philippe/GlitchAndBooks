import React from "react";

import "bootstrap";
import { Toast } from "react-bootstrap";

/**
 * ToasterProps Interface
 * @param setToasts: React.Dispatch<React.SetStateAction<string[]>> - Function to set the toasts
 * @param toasts: string[] - Array of toasts
 * @param bodyToast: string - Body of the toast
 */
interface ToasterProps {
  setToasts: React.Dispatch<React.SetStateAction<string[]>>;
  toasts: string[];
  bodyToast: string;
}

/**
 * Toast Component
 * Create a toast with the message passed in props
 * Meant to be used in a ToastContainer and to work with other toasts
 * @returns
 */
const Toaster: React.FC<ToasterProps> = ({ setToasts, toasts, bodyToast }) => {
  const [show, setShow] = React.useState<boolean>(true);

  /**
   * Remove the toast from the toasts array and hide the toast
   * @returns
   */
  const removeToast = () => {
    const index = toasts.indexOf(bodyToast);
    if (index > -1) {
      toasts.splice(index, 1);
    }
    setToasts(toasts);
    setShow(false);
  };

  return (
    <Toast
      show={show}
      onClose={() => {
        removeToast();
      }}
      delay={4000}
      autohide
    >
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
      <Toast.Body>{bodyToast}</Toast.Body>
    </Toast>
  );
};

export default Toaster;
