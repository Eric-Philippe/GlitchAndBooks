import { Book } from "../../models/Book";

/** @EXPORT_TYPES_FILTER */
/** Operation allowed for a BooleanType Filter  */
export type _BoolOperation = "YES" | "NO" | "BOTH";
/** Operation allowed for a IntType Filter  */
export type _IntOperation = "none" | "between" | "fewer" | "greater" | "equal";

/** @EXPORT_INTERFACE_TYPES_FILTER_PROPS */
/** Interface for a IntOperationAdvances Filter Props  */
export interface IntOperationAdvanced {
  operation: _IntOperation;
  value?: number;
  max?: number;
  min?: number;
}

/** Interface for a String Array Filter Props  */
export interface ItemStrArrayProps {
  data: string[];
  setStrArray: (b: string[]) => void;
}

/** Interface for an Int Filter Props */
export interface ItemIntOpProps {
  setMax: (n: number | undefined) => void;
  setMin: (n: number | undefined) => void;
  setValue: (n: number | undefined) => void;
  setOperation: (s: _IntOperation) => void;
}

/** Interface for a Boolean Filter Props */
export interface ItemBoolProps {
  setBool: (strA: _BoolOperation) => void;
}

/**
 * Regroup all the filters for the DynamicConsulter
 * @class
 * @property {string[]} _languages - Languages to filter
 * @property {string[]} _countries - Countries to filter
 * @property {string[]} _genres - Genres to filter
 * @property {string[]} _types - Types to filter
 * @property {_BoolOperation} _physical - Physical to filter
 * @property {_BoolOperation} _read - Read to filter
 * @property {_BoolOperation} _wantToRead - WantToRead to filter
 * @property {IntOperationAdvanced} _pages - Pages to filter
 * @property {IntOperationAdvanced} _year - Year to filter
 */
export default class Filters {
  public _languages: string[] = [];
  public _countries: string[] = [];
  public _genres: string[] = [];
  public _types: string[] = [];
  public _physical: _BoolOperation = "BOTH";
  public _read: _BoolOperation = "BOTH";
  public _wantToRead: _BoolOperation = "BOTH";
  public _pages: IntOperationAdvanced = { operation: "none" };
  public _year: IntOperationAdvanced = { operation: "none" };

  /**
   * Count the number of filters applied
   * @returns {number} Number of filters applied
   */
  countFilters() {
    let count = 0;
    if (this._languages.length > 0) count++;
    if (this._countries.length > 0) count++;
    if (this._genres.length > 0) count++;
    if (this._types.length > 0) count++;
    if (this._physical !== "BOTH") count++;
    if (this._read !== "BOTH") count++;
    if (this._wantToRead !== "BOTH") count++;
    if (this._pages.operation !== "none") count++;
    if (this._year.operation !== "none") count++;
    return count;
  }

  /**
   * Reset all the filters
   */
  reset() {
    this._languages = [];
    this._countries = [];
    this._genres = [];
    this._types = [];
    this._physical = "BOTH";
    this._read = "BOTH";
    this._wantToRead = "BOTH";
    this._pages = { operation: "none" };
    this._year = { operation: "none" };
  }

  /**
   * Filter the books with the filters applied
   * @param books Books to filter
   * @returns {Book[]} Books filtered
   */
  filterBooks(books: Book[]) {
    let filteredBooks = books;
    filteredBooks = this.filterLanguages(filteredBooks);
    filteredBooks = this.filterCountries(filteredBooks);
    filteredBooks = this.filterGenres(filteredBooks);
    filteredBooks = this.filterTypes(filteredBooks);
    filteredBooks = this.filterPhysical(filteredBooks);
    filteredBooks = this.filterRead(filteredBooks);
    filteredBooks = this.filterWantToRead(filteredBooks);
    filteredBooks = this.filterPages(filteredBooks);
    filteredBooks = this.filterYear(filteredBooks);
    return filteredBooks;
  }

  /** @INNER_FILTERS_METHODS */
  private filterLanguages(books: Book[]) {
    if (this._languages.length === 0) return books;
    return books.filter((b) => this._languages.includes(b.lang));
  }

  private filterCountries(books: Book[]) {
    if (this._countries.length === 0) return books;
    return books.filter((b) => this._countries.includes(b.originCountry));
  }

  private filterGenres(books: Book[]) {
    if (this._genres.length === 0) return books;
    return books.filter((b) =>
      this.filstonStringInPapaString(b.genres || [], this._genres)
    );
  }

  private filterTypes(books: Book[]) {
    if (this._types.length === 0) return books;
    return books.filter((b) => this._types.includes(b.type));
  }

  private filterPhysical(books: Book[]) {
    if (this._physical === "BOTH") return books;
    if (this._physical === "YES") return books.filter((b) => b.physical);
    return books.filter((b) => !b.physical);
  }

  private filterRead(books: Book[]) {
    if (this._read === "BOTH") return books;
    if (this._read === "YES") return books.filter((b) => b.read);
    return books.filter((b) => !b.read);
  }

  private filterWantToRead(books: Book[]) {
    if (this._wantToRead === "BOTH") return books;
    if (this._wantToRead === "YES") return books.filter((b) => b.wantRead);
    return books.filter((b) => !b.wantRead);
  }

  private filterPages(books: Book[]) {
    if (this._pages.operation === "none") return books;
    if (this._pages.operation === "between")
      return books.filter(
        (b) =>
          b.pages && b.pages >= this._pages.min! && b.pages <= this._pages.max!
      );
    if (this._pages.operation === "fewer")
      return books.filter((b) => b.pages && b.pages <= this._pages.max!);
    if (this._pages.operation === "greater")
      return books.filter((b) => b.pages && b.pages >= this._pages.min!);
    return books.filter((b) => b.pages && b.pages === this._pages.value!);
  }

  private filterYear(books: Book[]) {
    if (this._year.operation === "none") return books;
    if (this._year.operation === "between")
      return books.filter(
        (b) =>
          b.publicationYear &&
          b.publicationYear >= this._year.min! &&
          b.publicationYear <= this._year.max!
      );
    if (this._year.operation === "fewer")
      return books.filter(
        (b) => b.publicationYear && b.publicationYear <= this._year.max!
      );
    if (this._year.operation === "greater")
      return books.filter(
        (b) => b.publicationYear && b.publicationYear >= this._year.min!
      );
    return books.filter(
      (b) => b.publicationYear && b.publicationYear === this._year.value!
    );
  }

  private filstonStringInPapaString(papa: string[], filston: string[]) {
    if (filston.length === 0) return true;
    return filston.every((f) => papa.includes(f));
  }
}
