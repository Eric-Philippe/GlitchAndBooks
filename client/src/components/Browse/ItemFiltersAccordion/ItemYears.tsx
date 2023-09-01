import React, { useState } from "react";
import { ItemIntOpProps, _IntOperation } from "../Filters";

import "bootstrap";

const ItemYears: React.FC<ItemIntOpProps> = ({
  setMax,
  setMin,
  setValue,
  setOperation,
}) => {
  const [hasSetupFilter, setHasSetupFilter] = useState<boolean>(false);
  const [hasEnteredValues, setHasEnteredValues] = useState<boolean>(false);

  const [innerOperation, setInnerOperation] = useState<_IntOperation>("none");

  const changeFilter = () => {
    const inputElements = document.querySelectorAll('input[type="text"]');
    inputElements.forEach((inputElement) => {
      if (inputElement instanceof HTMLInputElement) {
        const parentFormGroup = inputElement.closest(".form-check");
        if (parentFormGroup) {
          const radio = parentFormGroup.querySelector('input[type="radio"]');
          if (radio && radio !== inputElement) {
            inputElement.value = "";
          }
        }
      }
    });

    setMax(undefined);
    setMin(undefined);
    setValue(undefined);

    if (innerOperation !== "none") setHasEnteredValues(false);
  };

  return (
    <div className="accordion-item">
      {/** @HEADER */}
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#years-filters"
          aria-expanded="false"
          aria-controls="years-filters"
        >
          Publication Year{" "}
          {hasSetupFilter && hasEnteredValues ? (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              1
            </span>
          ) : (
            ""
          )}
        </button>
      </h2>
      <div
        id="years-filters"
        className="accordion-collapse collapse"
        data-bs-parent="#accordionFlushFilters"
      >
        {/** @BODY */}
        <div className="accordion-body">
          {/** @Filter_1 [o] - None */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="years-filter"
              id="years-filter-none-value"
              defaultChecked
              onClick={() => {
                setHasSetupFilter(false);
                setInnerOperation("none");
                setOperation("none");
                changeFilter();
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="None"
              id="years-filter-none"
              readOnly
              disabled
            ></input>
          </div>

          {/** @Filter_2 [o] - [Max] [>] [Year] [>] [Min] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="years-filter"
              id="years-filter-between"
              onClick={() => {
                setHasSetupFilter(true);
                setInnerOperation("between");
                setOperation("between");
                changeFilter();
              }}
            ></input>
            <div className="input-group input-group-sm mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Max"
                id="years-filter-between-max"
                aria-label="Max"
                onChange={(e) => {
                  setHasEnteredValues(e.target.value !== "");
                  setMax(parseInt(e.target.value));
                }}
              ></input>
              <span className="input-group-text">&gt;</span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Year"
                id="years-filter-between-year"
                aria-label="Year"
                readOnly
                disabled
              ></input>
              <span className="input-group-text">&gt;</span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Min"
                id="years-filter-between-min"
                aria-label="Min"
                onChange={(e) => {
                  setHasEnteredValues(e.target.value !== "");
                  setMin(parseInt(e.target.value));
                }}
              ></input>
            </div>
          </div>

          {/** @Filter_3 [o] - [Max] [>] [Year] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="years-filter"
              id="years-filter-fewer"
              onClick={() => {
                setHasSetupFilter(true);
                setInnerOperation("fewer");
                setOperation("fewer");
                changeFilter();
              }}
            ></input>
            <div className="input-group input-group-sm mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Max"
                id="years-filter-fewer-max"
                aria-label="Max"
                onChange={(e) => {
                  setHasEnteredValues(e.target.value !== "");
                  setMax(parseInt(e.target.value));
                }}
              ></input>
              <span className="input-group-text">&gt;</span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Year"
                id="years-filter-fewer-year"
                aria-label="Year"
                readOnly
                disabled
              ></input>
            </div>
          </div>

          {/** @Filter_4 [o] - [Year] [>] [Min] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="years-filter"
              id="years-filter-greater-value"
              onClick={() => {
                setHasSetupFilter(true);
                setInnerOperation("greater");
                setOperation("greater");
                changeFilter();
              }}
            ></input>
            <div className="input-group input-group-sm mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Min"
                id="years-filter-greater-min"
                aria-label="Min"
                onChange={(e) => {
                  setHasEnteredValues(e.target.value !== "");
                  setMin(parseInt(e.target.value));
                }}
              ></input>
              <span className="input-group-text">&lt;</span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Year"
                id="years-filter-greater-year"
                aria-label="Year"
                readOnly
                disabled
              ></input>
            </div>
          </div>

          {/** @Filter_5 [o] - [Year] [=] [Valeur] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="years-filter"
              id="years-filter-greater"
              onClick={() => {
                setHasSetupFilter(true);
                setInnerOperation("equal");
                setOperation("equal");
                changeFilter();
              }}
            ></input>
            <div className="input-group input-group-sm">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Year"
                id="years-filter-greater-year-target"
                aria-label="Year"
                onChange={(e) => {
                  setHasEnteredValues(e.target.value !== "");
                  setValue(parseInt(e.target.value));
                }}
              ></input>
              <span className="input-group-text">=</span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Year"
                id="years-filter-greater-yea-inputr"
                aria-label="Year"
                readOnly
                disabled
              ></input>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemYears;
