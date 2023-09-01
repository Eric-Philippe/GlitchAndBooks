import React, { useState } from "react";
import { ItemIntOpProps, _IntOperation } from "../Filters";

import "bootstrap";

const ItemPages: React.FC<ItemIntOpProps> = ({
  setMax,
  setMin,
  setValue,
  setOperation,
}) => {
  const [hasSetupFilter, setHasSetupFilter] = useState<boolean>();
  const [hasEnteredValues, setHasEnteredValues] = useState<boolean>();

  const [innerOperation, setInnerOperation] = useState<_IntOperation>();

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
          data-bs-target="#pages-filters"
          aria-expanded="false"
          aria-controls="pages-filters"
        >
          Page numbers{" "}
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
        id="pages-filters"
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
              name="pages-filter"
              id="pages-filter-none"
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
              id="pages-filter-none-pages"
              readOnly
              disabled
            ></input>
          </div>

          {/** @Filter_2 [o] - [Max] [>] [Pages] [>] [Min] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="pages-filter"
              id="pages-filter-between"
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
                id="pages-filter-between-max"
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
                placeholder="Pages"
                id="pages-filter-between-pages"
                aria-label="Pages"
                readOnly
                disabled
              ></input>
              <span className="input-group-text">&gt;</span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Min"
                id="pages-filter-between-min"
                aria-label="Min"
                onChange={(e) => {
                  setHasEnteredValues(e.target.value !== "");
                  setMin(parseInt(e.target.value));
                }}
              ></input>
            </div>
          </div>

          {/** @Filter_3 [o] - [Max] [>] [Pages] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="pages-filter"
              id="pages-filter-fewer"
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
                id="pages-filter-fewer-max"
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
                placeholder="Pages"
                id="pages-filter-fewer-pages"
                aria-label="Pages"
                readOnly
                disabled
              ></input>
            </div>
          </div>

          {/** @Filter_4 [o] - [Pages] [>] [Min] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="pages-filter"
              id="pages-filter-greater"
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
                id="pages-filter-greater-min"
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
                placeholder="Pages"
                id="pages-filter-greater-pages"
                aria-label="Pages"
                readOnly
                disabled
              ></input>
            </div>
          </div>

          {/** @Filter_5 [o] - [Pages] [=] [Valeur] */}
          <div className="form-check">
            <input
              className="form-check-input "
              type="radio"
              name="pages-filter"
              id="pages-filter-equal"
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
                placeholder="Pages"
                id="pages-filter-equals-pages"
                aria-label="Pages"
                onChange={(e) => {
                  setHasEnteredValues(e.target.value !== "");
                  setValue(parseInt(e.target.value));
                }}
              ></input>
              <span className="input-group-text">=</span>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Pages"
                id="pages-filter-equal-pages"
                aria-label="Pages"
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

export default ItemPages;
