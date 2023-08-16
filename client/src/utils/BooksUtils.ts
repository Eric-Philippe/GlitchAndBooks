import { cp } from "fs";
import { Book } from "../models/Book";

export const buildAuthors = (
  authorCount: number
): {
  firstname: string[];
  lastname: string[];
} => {
  const authors: { firstname: string[]; lastname: string[] } = {
    firstname: [],
    lastname: [],
  };

  for (let i = 0; i < authorCount; i++) {
    const firstname = document.getElementById(
      "firstname_" + i
    ) as HTMLInputElement;
    const lastname = document.getElementById(
      "lastname_" + i
    ) as HTMLInputElement;

    let firstnameValue = firstname ? firstname.value.trim() : "";
    let lastnameValue = lastname ? lastname.value.trim() : "";

    authors.firstname.push(firstnameValue);
    authors.lastname.push(lastnameValue);
  }

  return authors;
};

export const buildGenres = (): string[] => {
  const genres: string[] = [];

  const genre = document.getElementById("genre-select") as HTMLSelectElement;

  // Genre is a multiple select
  for (let i = 0; i < genre.selectedOptions.length; i++) {
    if (genre.selectedOptions[i].value !== "")
      genres.push(genre.selectedOptions[i].value);
  }

  return genres;
};

export const bookEquals = (book1: Book, book2: Book): boolean => {
  if (book1.title !== book2.title) return false;
  // If the content of the array is different
  for (let i = 0; i < book1.firstname.length; i++) {
    if (book1.firstname[i] !== book2.firstname[i]) return false;
    if (book1.lastname[i] !== book2.lastname[i]) return false;
  }
  if (book1.genres == null) return false;
  if (book2.genres == null) return false;
  if (book1.genres.length !== book2.genres.length) return false;
  for (let i = 0; i < book1.genres.length; i++) {
    if (book1.genres[i] !== book2.genres[i]) return false;
  }
  if (book1.lang !== book2.lang) return false;
  if (book1.pages !== book2.pages) return false;
  if (book1.width !== book2.width) return false;
  if (book1.height !== book2.height) return false;
  if (book1.publicationYear !== book2.publicationYear) return false;
  if (book1.originCountry !== book2.originCountry) return false;
  if (book1.type !== book2.type) return false;
  if (book1.notes !== book2.notes) return false;
  if (book1.physical !== book2.physical) return false;
  if (book1.read !== book2.read) return false;
  if (book1.wantRead !== book2.wantRead) return false;

  return true;
};

export const createBook = (): Book => {
  const title = document.getElementById("title") as HTMLInputElement;
  const lang = document.getElementById("lang-select") as HTMLInputElement;
  const pages = document.getElementById("pages") as HTMLInputElement;
  const width = document.getElementById("width") as HTMLInputElement;
  const height = document.getElementById("height") as HTMLInputElement;
  const publicationYear = document.getElementById(
    "publication-year"
  ) as HTMLInputElement;
  const originCountry = document.getElementById(
    "origin-country"
  ) as HTMLInputElement;
  const type = document.getElementById("type-select") as HTMLInputElement;
  const notes = document.getElementById("notes") as HTMLInputElement;
  const physical = document.getElementById("physical") as HTMLInputElement;
  const read = document.getElementById("read") as HTMLInputElement;
  const wantRead = document.getElementById("want-read") as HTMLInputElement;

  const authorsCount = document.querySelectorAll(".author-form").length;
  const { firstname, lastname } = buildAuthors(authorsCount);
  const genre = buildGenres();

  const book: Book = {
    title: title.value.trim(),
    firstname: firstname,
    lastname: lastname,
    lang: lang.value,
    pages: pages ? parseInt(pages.value) : null,
    width: width ? parseInt(width.value) : null,
    height: height ? parseInt(height.value) : null,
    publicationYear:
      publicationYear && publicationYear.value !== ""
        ? parseInt(publicationYear.value)
        : null,
    originCountry: originCountry.value,
    type: type.value,
    genres: genre,
    notes: notes && notes.value !== "" ? notes.value.trim() : null,
    physical: physical.checked,
    read: read.checked,
    wantRead: wantRead.checked,
  };

  return book;
};
