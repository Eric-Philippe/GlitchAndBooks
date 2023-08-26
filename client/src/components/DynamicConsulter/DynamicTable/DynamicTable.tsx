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
import { FunnelFill, Recycle, Table } from "react-bootstrap-icons";
import {
  Button,
  ButtonGroup,
  Container,
  Table as BootstrapTable,
  FloatingLabel,
  FormControl,
  InputGroup,
  Modal,
  ToastContainer,
} from "react-bootstrap";
import FormEdit from "../FormEdit";
import Toaster from "../Toasts/Toaster";

/** @Filters main receiver for the user filters input */
const filters = new Filters();

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
  ressources,
}) => {
  /** Stateful React @Data_Rows Origin Point, for resets */
  let initialData = data;
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
  /** Stateful React @Sort */
  const [sortState, setSortState] = useState<{
    key: string;
    value: SortState;
    [key: string]: string | string[] | number | boolean | null | undefined;
  }>({ key: "", value: "NONE" });
  const [bookToEdit, setBookToEdit] = useState<Book>();
  const [newEventToToast, setNewEventToToast] = useState<string[]>([]);
  const [showModalEdit, setShowModalEdit] = useState<boolean>(false);
  const [showModalFilters, setShowModalFilters] = useState<boolean>(false);
  const [showModalColumns, setShowModalColumns] = useState<boolean>(false);

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

  const removeBook = (bookId: number) => {
    initialData = initialData.filter((book) => book.bookId !== bookId);
    setWholeViewedData(initialData);
    let newCurrentMinIndex = (currentPage - 1) * MAX_ROWS;
    setViewedData(
      initialData.slice(newCurrentMinIndex, wholeViewedData.length)
    );
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
    const previousEventToToast = newEventToToast;
    previousEventToToast.push("Reset done with success !");
    setNewEventToToast(previousEventToToast);
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

    window.scrollTo(0, 0);
  };

  /**
   * @Sort
   * @description Trie les données en fonction de la colonne et de l'ordre de tri
   * @param column Colonne à trier
   */
  const sort = (column: Column) => {
    let newSortState: SortState = "ASC";

    if (sortState.key === column.field) {
      if (sortState.value === "ASC") {
        newSortState = "DESC";
      } else if (sortState.value === "DESC") {
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
    const previousEventToToast = newEventToToast;
    previousEventToToast.push(`${filters.countFilters()} filters applied !`);
    setNewEventToToast(previousEventToToast);
  };

  return (
    <Container>
      {/** @FILTERS_MODAL */}
      <Modal show={showModalFilters} onHide={() => setShowModalFilters(false)}>
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5" id="filtersModalLabel">
            Filters
          </h1>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setShowModalFilters(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={() => loadFilters()}>
            Save changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/** @COLUMNS_MODAL */}
      <Modal show={showModalColumns} onHide={() => setShowModalColumns(false)}>
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5" id="columnsModalLabel">
            Columns
          </h1>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
      </Modal>

      {/** @EDIT_MODAL */}
      {showModalEdit ? (
        <FormEdit
          book={bookToEdit || initialData[5]}
          mainModalInBackground={false}
          ressources={ressources}
          showMainModalOuter={showModalEdit}
          setShowMainModalOuter={setShowModalEdit}
          removeBookFromList={removeBook}
          setNewEventToToast={setNewEventToToast}
          currentToasts={newEventToToast}
        />
      ) : (
        ""
      )}

      {/** @MAIN_PAGE */}
      <Container className="d-flex justify-content-center">
        <ButtonGroup aria-label="usages-buttons" className="mb-3">
          <Button
            variant="outline-primary"
            onClick={() => setShowModalFilters(true)}
          >
            <FunnelFill /> Filters
            {filtersCount !== 0 ? (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {filtersCount}
              </span>
            ) : (
              ""
            )}
          </Button>
          <Button
            variant="outline-success"
            onClick={() => setShowModalColumns(true)}
          >
            <Table />​ ​ Columns
          </Button>
          <Button
            variant="outline-danger"
            id="liveToastBtn"
            onClick={() => reset()}
          >
            <Recycle />​ ​ Reset
          </Button>
        </ButtonGroup>
      </Container>
      <InputGroup>
        <FloatingLabel controlId="floatingSearchLabel" label="Search ...">
          <FormControl
            type="text"
            placeholder="Search ..."
            value={searchValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              quickSearch(e.target.value);
            }}
          />
        </FloatingLabel>
        <Button variant="outline-secondary" disabled>
          🔍
        </Button>
      </InputGroup>
      <BootstrapTable className="table table-striped table-hover caption-top">
        <caption>{`${MAX_ROWS * (currentPage - 1)}-${
          MAX_ROWS * (currentPage - 1) + viewedData.length
        } / ${wholeViewedData.length}`}</caption>
        <thead>
          <tr>
            <th className="text-center">
              <button className="btn">Edit</button>
            </th>
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
              <td className="text-center">
                <Button
                  type="button"
                  variant="outline-secondary btn-sm"
                  onClick={() => {
                    setBookToEdit(book);
                    setShowModalEdit(true);
                  }}
                >
                  🖋️
                </Button>
              </td>
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
      </BootstrapTable>

      {/** @PAGINATION */}
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        perPage={MAX_ROWS}
        total={data.length}
      />

      {/** @TOASTS */}
      <ToastContainer className="p-3" position="bottom-end">
        {newEventToToast?.length > 0
          ? newEventToToast.map((event, index) => {
              return (
                <Toaster
                  bodyToast={event}
                  setToasts={setNewEventToToast}
                  toasts={newEventToToast}
                  key={index}
                />
              );
            })
          : ""}
      </ToastContainer>
    </Container>
  );
};

export default DynamicTable;
