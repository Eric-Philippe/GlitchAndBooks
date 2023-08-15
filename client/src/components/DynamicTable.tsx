import React, { ChangeEvent, useEffect, useState } from "react";
import { Book } from "../models/Book";
import Pagination from "./Pagination";
import { Column } from "../utils/DefaultColumns";
import SortBooks, { SortState } from "../utils/SortBooks";

/**
 * @default 50
 * @description Défini le nombre de lignes maximum par page
 */
const MAX_ROWS = 50;

/**
 * @interface DynamicTableProps
 * @description Définit les propriétés du composant DynamicTable
 * @param allColumns Toutes les colonnes possibles rangées par ordre de priorité pour être placée de gauche à droite
 * @param inputData Données à afficher
 * @param initColumns Colonnes à afficher par défaut
 * @param fieldToValue Fonction qui permet de récupérer la valeur d'un champ d'une ligne
 */
interface DynamicTableProps {
  allColumns: Column[];
  data: Book[];
  initColumns: Column[];
  fieldToValue: (value: any, field: string) => string;
}

/**
 * @function DynamicTable - Composant qui permet d'afficher un tableau dynamique avec des colonnes modifiables, des filtres et une pagination
 * @param param0 Propriétés du composant. Reférer à l'interface DynamicTableProps
 * @param allColumns Toutes les colonnes possibles rangées par ordre de priorité pour être placée de gauche à droite
 * @param inputData Données à afficher
 * @param initColumns Colonnes à afficher par défaut
 * @param fieldToValue Fonction qui permet de récupérer la valeur d'un champ d'une ligne
 *
 * @returns JSX.Element
 */
const DynamicTable: React.FC<DynamicTableProps> = ({
  allColumns,
  data,
  initColumns,
  fieldToValue,
}) => {
  const initialData = data;
  /** Stateful React @Data_Rows for filters / sort in the whole */
  const [wholeViewedData, setWholeViewedData] = useState<Book[]>(data);
  /** Stateful React @Data_Rows */
  const [viewedData, setViewedData] = useState<Book[]>(data.slice(0, MAX_ROWS));
  /** Stateful React @Search */
  const [searchValue, setSearchValue] = useState<string>("");
  /** Stateful React @Column */
  const [columns, setColumns] = useState<Column[]>(initColumns);
  /** Stateful React @Pagination */
  const [currentPage, setCurrentPage] = useState<number>(1);
  /** Stateful React @ModalCheckboxColumns */
  const [columnCheckboxes, setColumnCheckboxes] = useState<{
    [key: string]: boolean;
  }>({});
  /** Stateful React @ModalCheckboxColumns */
  const [sortState, setSortState] = useState<{
    key: string;
    value: SortState;
    [key: string]: string | string[] | number | boolean | null | undefined;
  }>({ key: "", value: "NONE" });

  // Code à exécuter après chaque rendu ou mise à jour du composant
  useEffect(() => {
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

  const reset = () => {
    setSearchValue("");
    setColumns(initColumns);
    setWholeViewedData(initialData);
    setViewedData(initialData.slice(0, MAX_ROWS));
    setCurrentPage(1);
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

  const sort = (column: Column) => {
    let newSortState: SortState = "ASC";

    if (sortState.key == column.field) {
      if (sortState.value == "ASC") {
        newSortState = "DESC";
      } else if (sortState.value == "DESC") {
        newSortState = "NONE";
      } else {
        newSortState = "ASC";
      }
    }

    setSortState({ key: column.field, value: newSortState });

    const dataType = column.type;
    setWholeViewedData(
      SortBooks.sortBooks(wholeViewedData, column.field, dataType, newSortState)
    );
    setViewedData(
      wholeViewedData.slice(
        (currentPage - 1) * MAX_ROWS,
        currentPage * MAX_ROWS
      )
    );
  };

  return (
    <div className="center-container">
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
            <div className="modal-body">...</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
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
            Filtres
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            data-bs-toggle="modal"
            data-bs-target="#columnsModal"
          >
            Columns
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => reset()}
          >
            Reset
          </button>
        </div>
      </div>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchValue}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            quickSearch(e.target.value);
          }}
        />
        <button className="btn btn-outline-secondary">🔍</button>
      </div>
      <table className="table table-striped table-hover caption-top">
        <caption>{`${50 * (currentPage - 1)}-${
          50 * (currentPage - 1) + viewedData.length
        } / ${wholeViewedData.length}`}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.field}>
                <button
                  className="btn"
                  onClick={() => {
                    sort(column);
                  }}
                >
                  {column.title}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {viewedData.map((book, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, columnIndex) => (
                <td
                  key={column.field + columnIndex}
                  className={column.center ? "centered-cell" : ""}
                >
                  {fieldToValue(book, column.field)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/** @PAGINATION */}
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        perPage={MAX_ROWS}
        total={data.length}
      />
    </div>
  );
};

export default DynamicTable;
