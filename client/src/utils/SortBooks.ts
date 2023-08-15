export default class SortBooks {
  public static sortBooks(
    books: any[],
    fieldName: string,
    dataType: string,
    sortType: string
  ) {
    switch (dataType) {
      case "string":
        return this.sortString(books, fieldName, sortType);
      case "number":
        return this.sortNumber(books, fieldName, sortType);
      case "date":
        return this.sortDate(books, fieldName, sortType);
      case "boolean":
        return this.sortBoolean(books, fieldName, sortType);
      case "string[]":
        return this.sortStringArray(books, fieldName, sortType);
      case "string[][]":
        return this.sortStringArrayArray(books, fieldName, sortType);
      default:
        return books;
    }
  }

  private static sortString(books: any[], fieldName: string, sortType: string) {
    return books.sort((a, b) => {
      const comparison = a[fieldName].localeCompare(b[fieldName]);

      if (sortType === "ASC") {
        return comparison;
      } else if (sortType === "DESC") {
        return -comparison;
      } else {
        return 0;
      }
    });
  }

  private static sortNumber(books: any[], fieldName: string, sortType: string) {
    return books.sort((a, b) => {
      const comparison = a[fieldName] - b[fieldName];

      if (sortType === "ASC") {
        return comparison;
      } else if (sortType === "DESC") {
        return -comparison;
      } else {
        return 0;
      }
    });
  }

  private static sortDate(books: any[], fieldName: string, sortType: string) {
    return books.sort((a, b) => {
      const comparison = a[fieldName] - b[fieldName];

      if (sortType === "ASC") {
        return comparison;
      } else if (sortType === "DESC") {
        return -comparison;
      } else {
        return 0;
      }
    });
  }

  private static sortBoolean(
    books: any[],
    fieldName: string,
    sortType: string
  ) {
    return books.sort((a, b) => {
      const comparison = a[fieldName] - b[fieldName];

      if (sortType === "ASC") {
        return comparison;
      } else if (sortType === "DESC") {
        return -comparison;
      } else {
        return 0;
      }
    });
  }

  private static sortStringArray(
    books: any[],
    fieldName: string,
    sortType: string
  ) {
    return books.sort((a, b) => {
      const aJoinedText = a[fieldName].join(", ");
      const bJoinedText = b[fieldName].join(", ");

      const comparison = aJoinedText.localeCompare(bJoinedText);

      if (sortType === "ASC") {
        return comparison;
      } else if (sortType === "DESC") {
        return -comparison;
      } else {
        return 0;
      }
    });
  }

  private static sortStringArrayArray(
    books: any[],
    fieldName: string,
    sortType: string
  ) {
    return books.sort((a, b) => {
      const aFirstnames = a["firstname"] as string[];
      const aLastnames = a["lastname"] as string[];
      const aAuthors = aFirstnames.map((aFirstnames, index) => {
        let first = aFirstnames != null ? aFirstnames : "";
        return first + " " + aLastnames[index];
      });

      const bFirstnames = b["firstname"] as string[];
      const bLastnames = b["lastname"] as string[];
      const bAuthors = bFirstnames.map((bFirstnames, index) => {
        let first = bFirstnames != null ? bFirstnames : "";
        return first + " " + bLastnames[index];
      });

      const aJoinedText = aAuthors.join(", ");
      const bJoinedText = bAuthors.join(", ");

      const comparison = aJoinedText.localeCompare(bJoinedText);

      if (sortType === "ASC") {
        return comparison;
      } else if (sortType === "DESC") {
        return -comparison;
      } else {
        return 0;
      }
    });
  }
}

export type SortState = "ASC" | "DESC" | "NONE";
