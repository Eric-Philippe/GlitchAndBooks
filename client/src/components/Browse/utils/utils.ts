import { Book } from "../../../models/Book";

export const bookFieldToText = (book: Book, field: string): string => {
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
      if (value === null) return "N/A";
      if (Array.isArray(value)) return value.join(", ");
      break;
  }

  return "N/A";
};

/**
 * @Download
 * @description Retourne la date du jour pour le nom du fichier et rajoute un 0 si le mois ou le jour est inférieur à 10
 * @returns string YYYYMMDD
 */
export const getDefaultFileTitle = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month =
    today.getMonth() + 1 < 10
      ? `0${today.getMonth() + 1}`
      : today.getMonth() + 1;
  const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
  return `${year}${month}${day}_day_bookshelf_save`;
};
