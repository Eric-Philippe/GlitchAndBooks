import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Books } from "../../../entities/Books";
import { Languages } from "../../../entities/Languages";
import { Types } from "../../../entities/Types";
import { CountryOrigin } from "../../../entities/CountryOrigin";
import { Genres } from "../../../entities/Genres";
import { Authors } from "../../../entities/Authors";
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
    .leftJoinAndSelect(
      Languages,
      "languages",
      "languages.languagesid = books.languagesid"
    )
    .leftJoinAndSelect(Types, "types", "types.typesid = books.typesid")
    .leftJoinAndSelect(
      CountryOrigin,
      "country",
      "country.countryoriginid = books.countryoriginid"
    )
    .execute();

  const result: BookI[] = [];

  for (const book of books) {
    const bookid = book.books_bookid;

    const myBook = await bookRepo.findOne({
      where: { bookid: bookid },
      relations: ["authors", "genres"],
    });

    const authors = myBook.authors;
    const genres = myBook.genres;

    const genre: string[] = [];
    for (const g of genres) {
      genre.push(g.name);
    }

    const firstname: string[] = [];
    const lastname: string[] = [];
    for (const a of authors) {
      firstname.push(a.firstname);
      lastname.push(a.lastname);
    }

    const dateDB = book.books_publication_date as Date;
    const year =
      dateDB == null
        ? null
        : new Date(dateDB.getTime() + 10 * 60000).getFullYear();

    result.push({
      height: book.books_height,
      width: book.books_width,
      title: book.books_title,
      firstname: firstname,
      lastname: lastname,
      lang: book.languages_langue,
      pages: book.books_page_number,
      publicationYear: year,
      originCountry: book.country_country,
      type: book.types_name,
      genres: genre,
      notes: book.books_notes,
      physical: book.books_physical,
      read: book.books_read,
      wantRead: book.books_want_to_read,
    });
  }

  console.log(result);

  res.send("get books");
}
