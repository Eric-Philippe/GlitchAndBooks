type ColumnType =
  | "string"
  | "string[]"
  | "string[][]"
  | "number"
  | "date"
  | "boolean"
  | "button";

type PhoneCardPlacement =
  | "title"
  | "paragraph"
  | "small-top-right"
  | "checkbox-bottom"
  | "small-paragraph"
  | "small-bottom";

/**
 * @interface Column
 * @description Définit les composantes de base d'une colonne
 * @param title Titre de la colonne
 * @param field Champ lien entre la colonne et les données
 * @param type Type de données de la colonne
 */
export interface Column {
  title: string;
  field: string;
  type: ColumnType;
  center?: boolean;
  phoneCardPlacement?: PhoneCardPlacement;
}

const Columns: Column[] = [
  {
    title: "Title",
    field: "title",
    type: "string",
    phoneCardPlacement: "title",
  },
  {
    title: "Authors",
    field: "authors",
    type: "string[][]",
    phoneCardPlacement: "paragraph",
  },
  {
    title: "Language",
    field: "lang",
    type: "string",
    center: true,
    phoneCardPlacement: "small-paragraph",
  },
  {
    title: "Pages",
    field: "pages",
    type: "number",
    center: true,
    phoneCardPlacement: "small-top-right",
  },
  {
    title: "Type",
    field: "type",
    type: "string",
    phoneCardPlacement: "small-paragraph",
  },
  {
    title: "Genre(s)",
    field: "genres",
    type: "string[]",
    phoneCardPlacement: "small-paragraph",
  },
  {
    title: "Publication",
    field: "publicationYear",
    type: "number",
    center: true,
    phoneCardPlacement: "small-top-right",
  },
  {
    title: "Country",
    field: "originCountry",
    type: "string",
    center: true,
    phoneCardPlacement: "small-paragraph",
  },
  {
    title: "Physical",
    field: "physical",
    type: "boolean",
    center: true,
    phoneCardPlacement: "checkbox-bottom",
  },
  {
    title: "Read",
    field: "read",
    type: "boolean",
    center: true,
    phoneCardPlacement: "checkbox-bottom",
  },
  {
    title: "Want to Read",
    field: "wantRead",
    type: "boolean",
    center: true,
    phoneCardPlacement: "checkbox-bottom",
  },
  {
    title: "Height (cm)",
    field: "height",
    type: "number",
    center: true,
    phoneCardPlacement: "small-bottom",
  },
  {
    title: "Width (cm)",
    field: "width",
    type: "number",
    center: true,
    phoneCardPlacement: "small-bottom",
  },
  {
    title: "Notes",
    field: "notes",
    type: "string",
  },
];

export const columnsHasField = (columns: Column[], field: string): boolean => {
  return columns.some((column) => column.field === field);
};

const defaultColumns: Column[] = [
  Columns[0],
  Columns[1],
  Columns[2],
  Columns[4],
  Columns[5],
];

export { Columns, defaultColumns };
