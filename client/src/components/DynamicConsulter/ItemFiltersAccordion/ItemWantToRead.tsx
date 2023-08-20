import React, { useState } from "react";

import "bootstrap";
import { ItemBoolProps } from "../Filters";

const ItemWantToRead: React.FC<ItemBoolProps> = ({ setBool }) => {
  const [hasSetupFilter, setHasSetupFilter] = useState<boolean>(false);

  return (
    <div className="accordion-item">
      {/** @HEADER */}
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#want-to-read-filters"
          aria-expanded="false"
          aria-controls="want-to-read-filters"
        >
          Want to Read{" "}
          {hasSetupFilter ? (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              1
            </span>
          ) : (
            ""
          )}
        </button>
      </h2>
      <div
        id="want-to-read-filters"
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
              name="want-to-read-filter"
              id="want-to-read-filter-both-f1"
              defaultChecked
              onClick={() => {
                setHasSetupFilter(false);
                setBool("BOTH");
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              id="want-to-read-filter-both-f1-ro"
              placeholder="Both"
              readOnly
              disabled
            ></input>
          </div>

          {/** @Filter_2 [o] - Yes */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="want-to-read-filter"
              id="want-to-read-filter-both-f2"
              onClick={() => {
                setHasSetupFilter(true);
                setBool("YES");
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              id="want-to-read-filter-both-f2-ro"
              placeholder="Yes"
              readOnly
              disabled
            ></input>
          </div>

          {/** @Filter_3 [o] - No */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="radio"
              name="want-to-read-filter"
              id="want-to-read-filter-both-f3"
              onClick={() => {
                setHasSetupFilter(true);
                setBool("NO");
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              id="want-to-read-filter-both-f3-ro"
              placeholder="No"
              readOnly
              disabled
            ></input>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemWantToRead;
