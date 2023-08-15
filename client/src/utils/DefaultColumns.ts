type ColumnType =
  | "string"
  | "string[]"
  | "string[][]"
  | "number"
  | "date"
  | "boolean";

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
}

const Columns: Column[] = [
  {
    title: "Titre",
    field: "title",
    type: "string",
  },
  {
    title: "Auteur",
    field: "authors",
    type: "string[][]",
  },
  {
    title: "Language",
    field: "lang",
    type: "string",
    center: true,
  },
  {
    title: "Pages",
    field: "pages",
    type: "number",
    center: true,
  },
  {
    title: "Type",
    field: "type",
    type: "string",
  },
  {
    title: "Genre(s)",
    field: "genres",
    type: "string[]",
  },
  {
    title: "Publication",
    field: "publicationYear",
    type: "number",
    center: true,
  },
  {
    title: "Country",
    field: "originCountry",
    type: "string",
    center: true,
  },
  {
    title: "Physical",
    field: "physical",
    type: "boolean",
    center: true,
  },
  {
    title: "Read",
    field: "read",
    type: "boolean",
    center: true,
  },
  {
    title: "Want to Read",
    field: "wantRead",
    type: "boolean",
    center: true,
  },
  {
    title: "Height (cm)",
    field: "height",
    type: "number",
    center: true,
  },
  {
    title: "Width (cm)",
    field: "width",
    type: "number",
    center: true,
  },
];

const defaultColumns: Column[] = [
  Columns[0],
  Columns[1],
  Columns[2],
  Columns[4],
  Columns[5],
];

export { Columns, defaultColumns };
