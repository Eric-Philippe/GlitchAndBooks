import { AppDataSource } from "../../../data-source";
import { Authors } from "../../../entities/Authors";
import { Books } from "../../../entities/Books";

export const linkAuthors = async (
  lastnames: string[],
  firstnames: string[],
  newBook: Books
) => {
  const authorsRepo = AppDataSource.getRepository(Authors); // Utilisation de getRepository au lieu de AppDataSource.getRepository

  for (let i = 0; i < lastnames.length; i++) {
    let firstname: string | null = firstnames[i] == "" ? null : firstnames[i];

    let author = await authorsRepo.findOne({
      where: {
        lastname: lastnames[i],
        firstname: firstname,
      },
      relations: ["books"], // Charger immédiatement la relation "books"
    });

    if (!author) {
      author = new Authors();
      author.lastname = lastnames[i];
      author.firstname = firstname;
    }

    if (author.books === undefined) {
      author.books = [newBook];
    } else {
      if (!author.books.some((book) => book.bookid === newBook.bookid)) {
        author.books.push(newBook);
      }
    }

    // Sauvegarder l'auteur
    await authorsRepo.save(author);
  }
};
