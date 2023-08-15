import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Books } from "../../../entities/Books";
import { BookI } from "../../../models/BookI";

export default async function getBooks(req: Request, res: Response) {
  const { userid } = req.query as { userid: string };
  if (!userid) {
    res.status(400).send("userid is required");
    return;
  }

  const bookRepo = AppDataSource.getRepository(Books);

  const books = await bookRepo
    .createQueryBuilder("books")
    .where("books.userid = :userid", { userid })
    .leftJoinAndSelect("books.languages", "languages")
    .leftJoinAndSelect("books.types", "types")
    .leftJoinAndSelect("books.countryorigin", "country")
    .leftJoinAndSelect("books.authors", "authors")
    .leftJoinAndSelect("books.genres", "genres")
    .getMany();

  const result: BookI[] = books.map((book) => {
    const authors = book.authors.map((author) => ({
      firstname: author.firstname,
      lastname: author.lastname,
    }));

    const firstname = authors.map((author) => author.firstname);
    const lastname = authors.map((author) => author.lastname);

    const genres = book.genres.map((genre) => genre.name);

    const publicationYear = book.publicationDate
      ? new Date(book.publicationDate).getFullYear() + 1
      : null;

    return {
      height: book.height,
      width: book.width,
      title: book.title,
      firstname,
      lastname,
      lang: book.languages.langue,
      pages: book.pageNumber,
      publicationYear,
      originCountry: book.countryorigin.country,
      type: book.types.name,
      genres,
      notes: book.notes,
      physical: book.physical,
      read: book.read,
      wantRead: book.wantToRead,
    };
  });

  //json

  res.status(200).json(result);
}
