import React, { ChangeEvent, useEffect, useState } from "react";

/** Import all the components to make the dynamic table works */
import Pagination from "../../Pagination";
import ItemPages from "../ItemFiltersAccordion/ItemPages";
import ItemYears from "../ItemFiltersAccordion/ItemYears";
import ItemRead from "../ItemFiltersAccordion/ItemRead";
import ItemWantToRead from "../ItemFiltersAccordion/ItemWantToRead";
import ItemPhysical from "../ItemFiltersAccordion/ItemPhysical";
import ItemLanguages from "../ItemFiltersAccordion/ItemLanguages";
import ItemTypes from "../ItemFiltersAccordion/ItemTypes";
import ItemGenres from "../ItemFiltersAccordion/ItemGenres";
import ItemCountries from "../ItemFiltersAccordion/ItemCountries";

/** Import all the worker classes */
import Filters, { _IntOperation } from "../Filters";
import Resources from "../../../middlewares/Resources";
import SortBooks, { SortState } from "../../../utils/SortBooks";

/** Import the interfaces */
import { Column } from "../utils/DefaultColumns";
import { _BoolOperation } from "../Filters";
import { Book } from "../../../models/Book";
import { Toast } from "bootstrap";
import DynamicCard from "./DynamicCard";

/** @Filters main receiver for the user filters input */
const filters = new Filters();

/**
 * @default 20
 * @description Défini le nombre de lignes maximum par page
 */
const MAX_ROWS = 20;

/**
 * @interface DynamicTableProps
 * @description Définit les propriétés du composant DynamicTable
 * @param allColumns Toutes les colonnes possibles rangées par ordre de priorité pour être placée de gauche à droite
 * @param inputData Données à afficher
 * @param initColumns Colonnes à afficher par défaut
 * @param fieldToValue Fonction qui permet de récupérer la valeur d'un champ d'une ligne
 * @param ressources Ressources de l'application
 */
interface DynamicTableProps {
  allColumns: Column[];
  data: Book[];
  initColumns: Column[];
  fieldToValue: (value: any, field: string) => string;
  ressources: Resources;
}

/**
 * @function DynamicCards - Composant qui permet d'afficher un tableau dynamique avec des colonnes modifiables, des filtres et une pagination
 * @param param0 Propriétés du composant. Reférer à l'interface DynamicTableProps
 * @param allColumns Toutes les colonnes possibles rangées par ordre de priorité pour être placée de gauche à droite
 * @param inputData Données à afficher
 * @param initColumns Colonnes à afficher par défaut
 * @param fieldToValue Fonction qui permet de récupérer la valeur d'un champ d'une ligne
 *
 * @returns JSX.Element
 */
const DynamicCards: React.FC<DynamicTableProps> = ({
  allColumns,
  data,
  initColumns,
  fieldToValue,
  ressources,
}) => {
  /** Stateful React @Data_Rows Origin Point, for resets */
  const initialData = data;
  /** Stateful React @Data_Rows half state filtered/sorted state for the data in the whole */
  const [wholeViewedData, setWholeViewedData] = useState<Book[]>(data);
  /** Stateful React @Data_Rows viewed Data @see MAX_ROWS */
  const [viewedData, setViewedData] = useState<Book[]>(data.slice(0, MAX_ROWS));
  /** Stateful React @Column Dynamic Column */
  const [columns, setColumns] = useState<Column[]>(initColumns);
  /** Stateful React @Column */
  const [columnCheckboxes, setColumnCheckboxes] = useState<{
    [key: string]: boolean;
  }>({});
  /** Stateful React @Search Quick Search */
  const [searchValue, setSearchValue] = useState<string>("");
  /** Stateful React @Pagination current page */
  const [currentPage, setCurrentPage] = useState<number>(1);
  /** Stateful React @Filters here to reload the filters when the user call a reset */
  const [resetKey, setResetKey] = useState(0); // Step 1: Key state variable
  /** Stateful React @Filters count the amount of filters activated */
  const [filtersCount, setFiltersCount] = useState(0); // Step 1: Key state variable

  // Code à exécuter après chaque rendu ou mise à jour du composant
  useEffect(() => {
    const toastTrigger = document.getElementById("liveToastBtn");
    const toastLiveReset = document.getElementById("liveToast") as HTMLElement;

    if (toastTrigger) {
      const toastBootstrap = Toast.getOrCreateInstance(toastLiveReset);
      toastTrigger.addEventListener("click", () => {
        toastBootstrap.show();
      });
    }

    const toastFilterTrigger = document.getElementById(
      "filtersModalSaveChanges"
    );
    const toastLiveFIlter = document.getElementById(
      "filtersToast"
    ) as HTMLElement;

    if (toastFilterTrigger) {
      const toastBootstrap = Toast.getOrCreateInstance(toastLiveFIlter);
      toastFilterTrigger.addEventListener("click", () => {
        toastBootstrap.show();
      });
    }

    // Initialiser les états des cases à cocher avec les valeurs initiales
    const initialColumnCheckboxes: { [key: string]: boolean } = {};
    allColumns.forEach((column) => {
      initialColumnCheckboxes[column.field] = initColumns.some(
        (col) => col.field === column.field
      );
    });

    setColumnCheckboxes(initialColumnCheckboxes);
  }, [allColumns, initColumns]);

  /**
   * @Columns
   * @function removeColumn - Supprime une colonne du tableau
   * @param columnField Champ de la colonne à supprimer
   */
  const removeColumn = (columnField: string) => {
    const newColumns = columns.filter((column) => column.field !== columnField);
    setColumns(newColumns);

    // Désactiver la case à cocher
    setColumnCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [columnField]: false,
    }));
  };

  /**
   * @Columns
   * @function addColumn - Ajoute une colonne au tableau en utilisant la priorité des colonnes
   * @param columnField Champ de la colonne à ajouter
   */
  const addColumn = (columnField: string) => {
    const newColumn = allColumns.find((column) => column.field === columnField);

    if (newColumn) {
      // Tri des colonnes en fonction de leur position dans allColumns
      const sortedColumns = [...columns, newColumn].sort((a, b) => {
        const indexA = allColumns.findIndex((col) => col.field === a.field);
        const indexB = allColumns.findIndex((col) => col.field === b.field);
        return indexA - indexB;
      });

      setColumns(sortedColumns);
    }
  };

  /**
   * @Search
   * @function quickSearch - Recherche rapide dans le tableau
   * @param searchTerm Terme de recherche
   */
  const quickSearch = (searchTerm: string) => {
    let reduced = searchTerm.length < searchValue.length;
    let isSearchEmpty = searchTerm.length === 0;

    setSearchValue(searchTerm);

    const dataToSearch =
      reduced || isSearchEmpty ? initialData : wholeViewedData;
    let newData = dataToSearch;

    if (!isSearchEmpty) {
      newData = dataToSearch.filter((book) => {
        const title = fieldToValue(book, "title").toLowerCase();
        const authors = fieldToValue(book, "authors").toLowerCase();
        return (
          title.includes(searchTerm.toLowerCase()) ||
          authors.includes(searchTerm.toLowerCase())
        );
      });
    }

    setWholeViewedData(newData);
    setViewedData(newData.slice(0, MAX_ROWS));
  };

  /**
   * @Reset
   * @function reset - Réinitialise les filtres, la recherche, les colonnes et les données affichées
   * @description Réinitialise les filtres, la recherche, les colonnes et les données affichées en mettant tout par défaut
   */
  const reset = () => {
    filters.reset();
    setSearchValue("");
    setColumns(initColumns);
    setColumnCheckboxes((prevCheckboxes) => {
      const newCheckboxes = { ...prevCheckboxes };
      Object.keys(newCheckboxes).forEach((key) => {
        newCheckboxes[key] = initColumns.some((col) => col.field === key);
      });
      return newCheckboxes;
    });
    setWholeViewedData(initialData);
    setViewedData(initialData.slice(0, MAX_ROWS));
    setCurrentPage(1);
    setFiltersCount(0);
    setResetKey((prevKey) => prevKey + 1);
  };

  /**
   * @Handler_Pagination
   * @param page
   */
  const handlePageChange = (page: number) => {
    const startIndex = (page - 1) * MAX_ROWS;
    const endIndex = startIndex + MAX_ROWS;

    // Use the filtered data from initialData
    const filteredData = wholeViewedData.filter((book) => {
      return allColumns.some((column) => {
        const value = fieldToValue(book, column.field).toLowerCase();
        return value.includes(searchValue.toLowerCase());
      });
    });

    setViewedData(filteredData.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  /**
   * @Sort
   * @description Trie les données en fonction de la colonne et de l'ordre de tri
   * @param column Colonne à trier
   */
  const sort = (field_sort: string) => {
    if (field_sort === "none") return;

    const newSortState: SortState = field_sort.split("_")[1] as SortState;
    const field = field_sort.split("_")[0];

    const dataType = columns.find((column) => column.field === field)
      ?.type as string;
    setWholeViewedData(
      SortBooks.sortBooks(wholeViewedData, field, dataType, newSortState)
    );
    setViewedData(
      wholeViewedData.slice(
        (currentPage - 1) * MAX_ROWS,
        currentPage * MAX_ROWS
      )
    );
  };

  /**
   * @Filters
   * @description Filtre les données en fonction des filtres
   * @param column Colonne à trier
   * @returns void
   */
  const loadFilters = () => {
    const filteredData = filters.filterBooks(initialData);
    setWholeViewedData(filteredData);
    setViewedData(filteredData.slice(0, MAX_ROWS));
    setFiltersCount(filters.countFilters());
  };

  return (
    <div className="center-container" id="phone-consulter">
      {/** @FILTERS_MODAL */}
      <div
        className="modal fade"
        id="filtersModal"
        tabIndex={-1}
        aria-labelledby="filtersModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="filtersModalLabel">
                Filters
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                className="accordion accordion-flush"
                id="accordionFlushFilters"
                key={resetKey}
              >
                <ItemPages
                  setMax={(i: number | undefined) => {
                    filters._pages.max = i;
                  }}
                  setMin={(i: number | undefined) => {
                    filters._pages.min = i;
                  }}
                  setValue={(i: number | undefined) => {
                    filters._pages.value = i;
                  }}
                  setOperation={(i: _IntOperation) => {
                    filters._pages.operation = i;
                  }}
                />
                <ItemYears
                  setMax={(i: number | undefined) => {
                    filters._year.max = i;
                  }}
                  setMin={(i: number | undefined) => {
                    filters._year.min = i;
                  }}
                  setValue={(i: number | undefined) => {
                    filters._year.value = i;
                  }}
                  setOperation={(i: _IntOperation) => {
                    filters._year.operation = i;
                  }}
                />
                <ItemRead
                  setBool={(b: _BoolOperation) => {
                    filters._read = b;
                  }}
                />
                <ItemWantToRead
                  setBool={(b: _BoolOperation) => {
                    filters._wantToRead = b;
                  }}
                />
                <ItemPhysical
                  setBool={(b: _BoolOperation) => {
                    filters._physical = b;
                  }}
                />
                <ItemLanguages
                  data={ressources.getLanguages()}
                  setStrArray={(strArray: string[]) => {
                    filters._languages = strArray;
                  }}
                />
                <ItemTypes
                  data={ressources.getTypes()}
                  setStrArray={(strArray: string[]) => {
                    filters._types = strArray;
                  }}
                />
                <ItemGenres
                  data={ressources.getGenres()}
                  setStrArray={(strArray: string[]) => {
                    filters._genres = strArray;
                  }}
                />
                <ItemCountries
                  data={ressources.getCountries()}
                  setStrArray={(strArray: string[]) => {
                    filters._countries = strArray;
                  }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                id="filtersModalSaveChanges"
                className="btn btn-primary"
                onClick={() => loadFilters()}
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
      {/** @COLUMNS_MODAL */}
      <div
        className="modal fade"
        id="columnsModal"
        tabIndex={-1}
        aria-labelledby="columnsModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="columnsModalLabel">
                Columns
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                {allColumns.map((column) => (
                  <div className="form-check" key={column.field}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={column.field}
                      id={column.field}
                      checked={columnCheckboxes[column.field] || false} // Default to false if not defined
                      onChange={(e) => {
                        if (e.target.checked) {
                          addColumn(column.field);
                        } else {
                          removeColumn(column.field);
                        }
                        setColumnCheckboxes((prevCheckboxes) => ({
                          ...prevCheckboxes,
                          [column.field]: e.target.checked,
                        }));
                      }}
                    />
                    <label className="form-check-label" htmlFor={column.field}>
                      {column.title}
                    </label>
                  </div>
                ))}
              </div>
              <select
                className="form-select form-select-sm"
                aria-label="Default select example"
                onChange={(e) => {
                  sort(e.target.value);
                }}
              >
                <option defaultValue={"none"}>Sort by</option>
                <option value="title_ASC">Title A-Z (ASC)</option>
                <option value="title_DESC">Title Z-A (DESC)</option>
                <option value="authors_ASC">Authors A-Z (ASC)</option>
                <option value="authors_DESC">Authors Z-A (DESC)</option>{" "}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/** @MAIN_PAGE */}
      <div className="d-flex justify-content-center align-items-center mb-4">
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#filtersModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-funnel-fill"
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h12a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.128.334L10 8.692V13.5a.5.5 0 0 1-.342.474l-3 1A.5.5 0 0 1 6 14.5V8.692L1.628 3.834A.5.5 0 0 1 1.5 3.5v-2z"></path>
            </svg>
            ​ ​ Filtres{" "}
            {filtersCount !== 0 ? (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {filtersCount}
              </span>
            ) : (
              ""
            )}
          </button>
          <button
            type="button"
            className="btn btn-outline-success"
            data-bs-toggle="modal"
            data-bs-target="#columnsModal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-table"
              viewBox="0 0 16 16"
            >
              <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"></path>
            </svg>
            ​ ​ Columns
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            id="liveToastBtn"
            onClick={() => reset()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-recycle"
              viewBox="0 0 16 16"
            >
              <path d="M9.302 1.256a1.5 1.5 0 0 0-2.604 0l-1.704 2.98a.5.5 0 0 0 .869.497l1.703-2.981a.5.5 0 0 1 .868 0l2.54 4.444-1.256-.337a.5.5 0 1 0-.26.966l2.415.647a.5.5 0 0 0 .613-.353l.647-2.415a.5.5 0 1 0-.966-.259l-.333 1.242-2.532-4.431zM2.973 7.773l-1.255.337a.5.5 0 1 1-.26-.966l2.416-.647a.5.5 0 0 1 .612.353l.647 2.415a.5.5 0 0 1-.966.259l-.333-1.242-2.545 4.454a.5.5 0 0 0 .434.748H5a.5.5 0 0 1 0 1H1.723A1.5 1.5 0 0 1 .421 12.24l2.552-4.467zm10.89 1.463a.5.5 0 1 0-.868.496l1.716 3.004a.5.5 0 0 1-.434.748h-5.57l.647-.646a.5.5 0 1 0-.708-.707l-1.5 1.5a.498.498 0 0 0 0 .707l1.5 1.5a.5.5 0 1 0 .708-.707l-.647-.647h5.57a1.5 1.5 0 0 0 1.302-2.244l-1.716-3.004z" />
            </svg>
            ​ ​ Reset
          </button>
        </div>
      </div>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            quickSearch(e.target.value);
          }}
        />
        <button className="btn btn-outline-secondary" disabled>
          🔍
        </button>
      </div>

      <small>{`${MAX_ROWS * (currentPage - 1)}-${
        MAX_ROWS * (currentPage - 1) + viewedData.length
      } / ${wholeViewedData.length}`}</small>
      <div className="list-group mb-3">
        {viewedData.map((book) => (
          <DynamicCard book={book} currentColumns={columns} key={book.title} />
        ))}
      </div>

      {/** @PAGINATION */}
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        perPage={MAX_ROWS}
        total={data.length}
      />

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <img
              src="./logos/G&B_dark-transp-circle.png"
              className="rounded me-2"
              style={{ width: "20px" }}
              alt="..."
            ></img>
            <strong className="me-auto">Glitch & Books</strong>
            <small>Just now</small>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            <strong>Reset</strong> effectué avec succès !
          </div>
        </div>
      </div>
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="filtersToast"
          className="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <img
              src="./logos/G&B_dark-transp-circle.png"
              className="rounded me-2"
              style={{ width: "20px" }}
              alt="G&B Logo"
            ></img>
            <strong className="me-auto">Glitch & Books</strong>
            <small>Just now</small>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">
            <strong>{filtersCount}</strong> filtre(s) appliqués avec succès !
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicCards;
