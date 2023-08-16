export interface Book {
  bookId?: number;
  title: string;
  firstname: string[];
  lastname: string[];
  lang: string;
  pages: number | null;
  width: number | null;
  height: number | null;
  publicationYear: number | null;
  originCountry: string;
  type: string;
  genres: string[] | null;
  notes: string | null;
  physical: boolean;
  read: boolean;
  wantRead: boolean;
  [key: string]: string | string[] | number | boolean | null | undefined;
}
