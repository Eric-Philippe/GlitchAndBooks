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
import DynamicCard from "./DynamicCard";
import {
  Button,
  ButtonGroup,
  Container,
  FloatingLabel,
  FormControl,
  FormSelect,
  InputGroup,
  Modal,
  OverlayTrigger,
  ToastContainer,
  Tooltip,
  Form,
} from "react-bootstrap";
import {
  CloudArrowDown,
  FunnelFill,
  Recycle,
  Table,
} from "react-bootstrap-icons";
import Toaster from "../Toasts/Toaster";
import { getDefaultFileTitle } from "../utils/utils";

/** @Filters main receiver for the user filters input */
const filters = new Filters();

/**
 * @default 20
 * @description Défini le nombre de lignes maximum par page
 */
const MAX_ROWS = 20;

/**
 * @interface DynamicCardsProps
 * @description Définit les propriétés du composant DynamicTable
 * @param allColumns Toutes les colonnes possibles rangées par ordre de priorité pour être placée de gauche à droite
 * @param inputData Données à afficher
 * @param initColumns Colonnes à afficher par défaut
 * @param fieldToValue Fonction qui permet de récupérer la valeur d'un champ d'une ligne
 * @param ressources Ressources de l'application
 */
interface DynamicCardsProps {
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
const DynamicCards: React.FC<DynamicCardsProps> = ({
  allColumns,
  data,
  initColumns,
  fieldToValue,
  ressources,
}) => {
  /**  @Data_Rows Origin Point, for resets */
  let initialData = data;

  /** =========================== */
  /** @STATES_REACT_DECLARATIONS */
  /** ========================= */

  /** Stateful React @Data_Rows half state filtered/sorted state for the data in the whole */
  const [wholeViewedData, setWholeViewedData] = useState<Book[]>(data);
  /** Stateful React @Data_Rows viewed Data @see MAX_ROWS */
  const [viewedData, setViewedData] = useState<Book[]>(data.slice(0, MAX_ROWS));

  /** Stateful React @Filters here to reload the filters when the user call a reset */
  const [resetKey, setResetKey] = useState(0);
  /** Stateful React @Filters count the amount of filters activated */
  const [filtersCount, setFiltersCount] = useState(0);
  /** Stateful React @Filters in order to show to Filters Panel */
  const [showModalFilters, setShowModalFilters] = useState<boolean>(false);

  /** Stateful React @Column Dynamic Column */
  const [columns, setColumns] = useState<Column[]>(initColumns);
  /** Stateful React @Column */
  const [columnCheckboxes, setColumnCheckboxes] = useState<{
    [key: string]: boolean;
  }>({});
  /** Stateful React @Column in order to display the Columns Picker Panel */
  const [showModalColumns, setShowModalColumns] = useState<boolean>(false);

  /** Stateful React @Download */
  const [showModalDownload, setShowModalDownload] = useState<boolean>(false);
  const [downloadFormat, setdownloadFormat] = useState<string>("");
  const [downloadFileName, setdownloadFileName] = useState<string>(
    getDefaultFileTitle()
  );

  /** Stateful React @Search Quick Search */
  const [searchValue, setSearchValue] = useState<string>("");

  /** Stateful React @Pagination current page */
  const [currentPage, setCurrentPage] = useState<number>(1);

  /** Stateful React @Events_Toasts to list all the toast events to display */
  const [newEventToToast, setNewEventToToast] = useState<string[]>([]);

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
   * @Data_Rows
   * @function removeBook - Supprime un livre du tableau
   * @param bookId Id du livre à supprimer
   */
  const removeBook = (bookId: number) => {
    initialData = initialData.filter((book) => book.bookId !== bookId);
    setWholeViewedData(initialData);
    let newCurrentMinIndex = (currentPage - 1) * MAX_ROWS;
    setViewedData(
      initialData.slice(newCurrentMinIndex, wholeViewedData.length)
    );
  };

  /**
   * @Data_Rows
   * @function editBook - Edite un livre du tableau
   * @param book Livre à éditer
   */
  const editBook = (book: Book) => {
    const bookIndex = initialData.findIndex(
      (bookToFind) => bookToFind.bookId === book.bookId
    );
    initialData[bookIndex] = book;
    setWholeViewedData(initialData);
    let newCurrentMinIndex = (currentPage - 1) * MAX_ROWS;
    setViewedData(
      initialData.slice(newCurrentMinIndex, wholeViewedData.length)
    );
    reset(false);
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
   * @Download
   * @description Télécharge les données en fonction du format choisi
   * @returns void
   */
  const downloadData = () => {
    if (downloadFormat === "") return;

    const token = localStorage.getItem("token");

    fetch("/api/v1/data_saver", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // Send the format to the server
      body: JSON.stringify({
        format: downloadFormat,
        userId: localStorage.getItem("userid"),
      }),
    })
      .then(async (response) => {
        if (response.status === 200) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${downloadFileName}.${downloadFormat}`;
          document.body.appendChild(a);
          a.click();
          a.remove();

          setShowModalDownload(false);
        } else {
          const errorData = await response.json();
          console.error("Error downloading data:", errorData.error);
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
        // Handle the error or show an error message to the user
      });
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

    let newData: Book[] = [];

    if (!isSearchEmpty) {
      newData = filters.filterBooks(dataToSearch).filter((book) => {
        const title = fieldToValue(book, "title").toLowerCase();
        const authors = fieldToValue(book, "authors").toLowerCase();
        return (
          title.includes(searchTerm.toLowerCase()) ||
          authors.includes(searchTerm.toLowerCase())
        );
      });
    } else {
      newData = filters.filterBooks(dataToSearch);
    }

    setWholeViewedData(newData);
    setViewedData(newData.slice(0, MAX_ROWS));
  };

  /**
   * @Reset
   * @function reset - Réinitialise les filtres, la recherche, les colonnes et les données affichées
   * @description Réinitialise les filtres, la recherche, les colonnes et les données affichées en mettant tout par défaut
   */
  const reset = (showToast: boolean = true) => {
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
    if (showToast) {
      const previousEventToToast = newEventToToast;
      previousEventToToast.push("Reset done with success !");
      setNewEventToToast(previousEventToToast);
    }
  };

  /**
   * @Pagination
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

  const pickRandomBook = () => {
    const data = filters.filterBooks(initialData);

    const randomBook = data[Math.floor(Math.random() * data.length)];

    setWholeViewedData([randomBook]);
    setViewedData([randomBook]);
    setSearchValue(randomBook.title);
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
          <div className="mb-3">
            {allColumns.map((column) => (
              <div className="form-check" key={column.field}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  value={column.field}
                  id={column.field}
                  checked={columnCheckboxes[column.field] || false} // Default to false if not defined
                  disabled={column.field === "notes"}
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
                  {column.field === "notes" ? (
                    <small className="text-muted">
                      (Access it by double tapping on a book)
                    </small>
                  ) : null}
                </label>
              </div>
            ))}
          </div>
          <FormSelect
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
          </FormSelect>
        </Modal.Body>
      </Modal>

      {/** @DOWNLOAD_MODAL */}
      <Modal
        show={showModalDownload}
        onHide={() => {
          setShowModalDownload(false);
          setdownloadFileName(getDefaultFileTitle());
        }}
        centered
      >
        <Modal.Header closeButton>
          <h1 className="modal-title fs-5" id="columnsModalLabel">
            Download Data
          </h1>
        </Modal.Header>
        <Modal.Body>
          <FloatingLabel
            controlId="floatingSelect"
            label="Pick a file format to save your data"
          >
            <Form.Select onChange={(e) => setdownloadFormat(e.target.value)}>
              <option value="">Choose format...</option>
              <option value="json">.json</option>
              <option value="csv">.csv</option>
              <option value="xml">.xml</option>
              <option value="xlsx">.xlsx</option>
              <option value="pdf">.pdf</option>
            </Form.Select>
          </FloatingLabel>
          <br />
          <Form.Label htmlFor="filename" hidden={downloadFormat === ""}>
            Filename
          </Form.Label>
          <InputGroup hidden={downloadFormat === ""}>
            <Form.Control
              type="text"
              id="filename"
              value={downloadFileName}
              onChange={(e) => setdownloadFileName(e.target.value)}
            />
            <InputGroup.Text id="basic-addon2">{`.${downloadFormat}`}</InputGroup.Text>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setShowModalDownload(false);
              setdownloadFileName(getDefaultFileTitle());
            }}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              downloadData();
            }}
            disabled={downloadFormat === "" || downloadFileName === ""}
          >
            Download
          </Button>
        </Modal.Footer>
      </Modal>

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
            variant="outline-info"
            onClick={() => setShowModalDownload(true)}
          >
            <CloudArrowDown />​ ​ Download
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
        <OverlayTrigger
          key={"top"}
          placement={"top"}
          overlay={
            <Tooltip id={`tooltip-top`}>
              Pick a random book among the viewed ones
            </Tooltip>
          }
        >
          <Button
            variant="outline-info"
            onClick={() => {
              pickRandomBook();
            }}
          >
            🎲
          </Button>
        </OverlayTrigger>
      </InputGroup>
      <InputGroup className="mb-3">
        <small className="text-muted">
          <i>​ ​ Long Press a book to access edit</i>
        </small>
      </InputGroup>

      <small>{`${MAX_ROWS * (currentPage - 1)}-${
        MAX_ROWS * (currentPage - 1) + viewedData.length
      } / ${wholeViewedData.length}`}</small>
      <div className="list-group mb-3">
        {viewedData.map((book, index) => (
          <DynamicCard
            book={book}
            currentColumns={columns}
            key={index}
            resources={ressources}
            removeBook={removeBook}
            editBook={editBook}
            setNewEvent={setNewEventToToast}
            newEvents={newEventToToast}
          />
        ))}
      </div>

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

export default DynamicCards;
