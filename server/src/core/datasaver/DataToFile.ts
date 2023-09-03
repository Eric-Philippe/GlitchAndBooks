import fs from "fs";

import { AppDataSource } from "../../data-source";
import { Books } from "../../entities/Books";

export abstract class DataToFile {
  protected readonly folderPath = `${__dirname}/../../../temp/`;
  protected extension: string;
  protected userId: string;

  protected bookData: Books[];

  constructor(userId: string) {
    this.userId = userId;
  }

  /**
   * Fetches the data from the database and save in a file
   * @returns The full path of the file
   */
  abstract save(): Promise<string | null>;

  protected clearFile(): number {
    try {
      fs.unlinkSync(this.folderPath);
      return 1;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  protected async fetchData(userId: string) {
    const bookRepo = AppDataSource.getRepository(Books);

    const books = await bookRepo
      .createQueryBuilder("books")
      .where("books.userid = :userId", { userId })
      .leftJoinAndSelect("books.languages", "languages")
      .leftJoinAndSelect("books.types", "types")
      .leftJoinAndSelect("books.countryorigin", "country")
      .leftJoinAndSelect("books.authors", "authors")
      .leftJoinAndSelect("books.genres", "genres")
      .getMany();

    this.bookData = books;
  }

  protected getFileName(): string {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let dayStr = day < 10 ? "0" + day : day;
    let monthStr = month < 10 ? "0" + month : month;

    const fileName = `${year}${monthStr}${dayStr}_bookshelf_save${this.extension}`;

    return fileName;
  }
}
