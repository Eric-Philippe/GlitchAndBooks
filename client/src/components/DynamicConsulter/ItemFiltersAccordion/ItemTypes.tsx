import React, { useState } from "react";
import { ItemStrArrayProps } from "../Filters";

import "bootstrap";

const ItemTypes: React.FC<ItemStrArrayProps> = ({ data, setStrArray }) => {
  const [hasSetupFilter, setHasSetupFilter] = useState<boolean>(false);
  const [hasPickedValues, setHasPickedValues] = useState<boolean>(false);

  return (
    <div className="accordion-item">
      {/** @HEADER */}
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#types-filters"
          aria-expanded="false"
          aria-controls="types-filters"
        >
          Types{" "}
          {hasSetupFilter && hasPickedValues ? (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              1
            </span>
          ) : (
            ""
          )}
        </button>
      </h2>
      <div
        id="types-filters"
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
              name="types-filter"
              id="types-filter-both-f1"
              defaultChecked
              onClick={() => {
                setHasSetupFilter(false);
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="None"
              readOnly
              disabled
            ></input>
          </div>

          {/** @Filter_2 [o] - Select */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="types-filter"
              id="types-filter-both-f2"
              onClick={() => {
                setHasSetupFilter(true);
              }}
            ></input>
            <select
              className="form-select form-select-sm"
              aria-label="Small select example"
              multiple
              onChange={(event) => {
                const selectedOptions = Array.from(
                  event.target.selectedOptions
                );
                const userHasPickedValues = selectedOptions.length > 0;
                setHasPickedValues(userHasPickedValues);
                setStrArray(selectedOptions.map((option) => option.value));
              }}
            >
              <option disabled defaultValue={""}>
                Select a language
              </option>
              {data.map((type, index) => {
                return (
                  <option key={index} value={type}>
                    {type}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemTypes;
