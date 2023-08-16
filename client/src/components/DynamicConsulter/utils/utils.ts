import { Book } from "../../../models/Book";

export const bookFieldToText = (book: Book, field: string) => {
  if (field === "authors") {
    const firstnames = book["firstname"] as string[];
    const lastnames = book["lastname"] as string[];
    const authors = firstnames.map((firstname, index) => {
      let first = firstname != null ? firstname : "";
      return first + " " + lastnames[index];
    });

    return authors.join(", ");
  }

  const value = book[field];

  switch (typeof value) {
    case "string":
      return value;
    case "number":
      return value.toString();
    case "boolean":
      return value ? "✅" : "❌";
    case "undefined":
      return "non défini";
    case "object":
      if (value === null) {
        return "N/A";
      }
      break;
  }

  return "N/A";
};
