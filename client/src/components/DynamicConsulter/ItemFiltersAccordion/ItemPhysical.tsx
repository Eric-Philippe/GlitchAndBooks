import React, { useState } from "react";

import "bootstrap";
import { ItemBoolProps } from "../Filters";

const ItemPhysical: React.FC<ItemBoolProps> = ({ setBool }) => {
  const [hasSetupFilter, setHasSetupFilter] = useState<boolean>(false);

  return (
    <div className="accordion-item">
      {/** @HEADER */}
      <h2 className="accordion-header">
        <button
          className="accordion-button collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#physical-filters"
          aria-expanded="false"
          aria-controls="physical-filters"
        >
          Physical{" "}
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
        id="physical-filters"
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
              name="physical-filter"
              id="physical-filter-both-f1"
              defaultChecked
              onClick={() => {
                setHasSetupFilter(false);
                setBool("BOTH");
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              id="physical-filter-both-f1-ro"
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
              name="physical-filter"
              id="physical-filter-both-f2"
              onClick={() => {
                setHasSetupFilter(true);
                setBool("YES");
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              id="physical-filter-both-f2-ro"
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
              name="physical-filter"
              id="physical-filter-both-f3"
              onClick={() => {
                setHasSetupFilter(true);
                setBool("NO");
              }}
            ></input>
            <input
              type="text"
              className="form-control form-control-sm"
              id="physical-filter-both-f3-ro"
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

export default ItemPhysical;
