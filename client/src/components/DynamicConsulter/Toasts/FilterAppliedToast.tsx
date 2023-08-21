import React from "react";

import "bootstrap";
import { Toast, ToastContainer } from "react-bootstrap";

interface FilterAppliedToastProps {
  showToast: boolean;
  setShowToastFilter: React.Dispatch<React.SetStateAction<boolean>>;
  filtersCount: number;
}

const FilterAppliedToast: React.FC<FilterAppliedToastProps> = ({
  showToast,
  setShowToastFilter,
  filtersCount,
}) => {
  return (
    <ToastContainer className="p-3" position="bottom-end">
      <Toast show={showToast} onClose={() => setShowToastFilter(false)}>
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
        <Toast.Body>
          <strong>{filtersCount}</strong> filter(s) applied successfully !
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default FilterAppliedToast;
