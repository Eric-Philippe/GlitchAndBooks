import xml from "xml";
import fs from "fs";

import { DataToFile } from "./DataToFile";
import { Books } from "../../entities/Books";

export class DataToXml extends DataToFile {
  protected extension: string = ".xml";

  async save(): Promise<string | null> {
    await this.fetchData(this.userId);

    const fileName = this.getFileName();
    const fullFilePath = `${this.folderPath}${fileName}`;

    try {
      const xmlContent = await this.convertToXml(this.bookData);
      fs.writeFileSync(fullFilePath, xmlContent);

      return fullFilePath;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private convertToXml(data: Books[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const xmlBooksArray = data.map((book) => {
        return {
          book: [
            { bookid: book.bookid },
            { title: book.title },
            { pageNumber: book.pageNumber },
            { height: book.height },
            { width: book.width },
            { read: book.read },
            { publicationDate: book.publicationDate },
            { wantToRead: book.wantToRead },
            { notes: book.notes },
            { physical: book.physical },
            {
              originCountry: [
                {
                  country: book.countryorigin ? book.countryorigin.country : "",
                }, // Include country name
              ],
            },
            {
              authors: book.authors.map((author) => {
                return {
                  author: [{}],
                };
              }),
            },
            {
              genres: book.genres.map((genre) => {
                return {
                  genre: [{}],
                };
              }),
            },
            {
              type: [
                { name: book.types ? book.types.name : "" }, // Include type name
              ],
            },
            {
              language: [
                { langue: book.languages ? book.languages.langue : "" }, // Include language name
              ],
            },
          ],
        };
      });

      const xmlContent = xml(
        { books: xmlBooksArray },
        { declaration: true, indent: true }
      );
      resolve(xmlContent);
    });
  }
}
