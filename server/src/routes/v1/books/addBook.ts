import { Request, Response } from "express";
import { BookI } from "../../../models/BookI";
import { AppDataSource } from "../../../data-source";
import { Books } from "../../../entities/Books";
import { Users } from "../../../entities/Users";
import { Genres } from "../../../entities/Genres";
import { linkAuthors } from "../author/linkAuthors";
import { CountryOrigin } from "../../../entities/CountryOrigin";
import { Types } from "../../../entities/Types";
import { Languages } from "../../../entities/Languages";

export default async function addBook(req: Request, res: Response) {
  const { book, userid } = req.body as {
    book: BookI;
    userid: string;
  };

  try {
    const repoBook = AppDataSource.getRepository(Books);
    const repoUser = AppDataSource.getRepository(Users);
    const repoGenres = AppDataSource.getRepository(Genres);
    const repoCountry = AppDataSource.getRepository(CountryOrigin);
    const repoTypes = AppDataSource.getRepository(Types);
    const repoLang = AppDataSource.getRepository(Languages);

    const user = await repoUser.findOneBy({ userid: parseInt(userid) });

    const genres = book.genres;

    const newBookGenres: Genres[] = [];
    for (const genreStr of genres) {
      const genre = await repoGenres.findOneBy({ name: genreStr });
      newBookGenres.push(genre);
    }

    const country = await repoCountry.findOneBy({
      country: book.originCountry,
    });
    const type = await repoTypes.findOneBy({ name: book.type });
    const language = await repoLang.findOneBy({ langue: book.lang });

    const publicationYear = book.publicationYear;
    const publicationDate = new Date(publicationYear, 0, 1);

    const newBook = new Books();
    newBook.title = book.title;
    newBook.pageNumber = book.pages;
    newBook.height = book.height;
    newBook.width = book.width;
    newBook.read = book.read;
    newBook.publicationDate = publicationDate;
    newBook.wantToRead = book.wantRead;
    newBook.notes = book.notes;
    newBook.physical = book.physical;
    newBook.user = user;
    newBook.genres = newBookGenres;
    newBook.countryorigin = country;
    newBook.types = type;
    newBook.languages = language;

    const savedBook = await repoBook.save(newBook);
    linkAuthors(book.lastname, book.firstname, savedBook);

    res.status(200).json({ message: "ok" });
  } catch (err) {
    console.log("Error");
    res.status(500).json({ message: "error" });
  }
}
