import XLSX from "xlsx";

import { DataToFile } from "./DataToFile";
import { Books } from "../../entities/Books";

export class DataToXlsx extends DataToFile {
  protected extension: string = ".xlsx";

  async save(): Promise<string | null> {
    await this.fetchData(this.userId);

    const fileName = this.getFileName();
    const fullFilePath = `${this.folderPath}${fileName}`;

    try {
      const xlsxContent = await this.convertToXlsx(this.bookData);
      XLSX.writeFile(xlsxContent, fullFilePath);

      return fullFilePath;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private convertToXlsx(data: Books[]): Promise<XLSX.WorkBook> {
    return new Promise((resolve, reject) => {
      // Flatten the data and include type names and language names
      const flattenedData = data.map((book) => ({
        bookid: book.bookid,
        title: book.title,
        pageNumber: book.pageNumber,
        height: book.height,
        width: book.width,
        read: book.read,
        publicationDate: book.publicationDate,
        wantToRead: book.wantToRead,
        notes: book.notes,
        physical: book.physical,
        originCountry: book.countryorigin ? book.countryorigin.country : "", // Include country name
        authors: book.authors
          ? book.authors
              .map((author) => `${author.firstname} ${author.lastname}`)
              .join(", ")
          : "", // Include author names
        genres: book.genres
          ? book.genres.map((genre) => genre.name).join(", ")
          : "", // Include genre names
        type: book.types ? book.types.name : "", // Include type name
        language: book.languages ? book.languages.langue : "", // Include language name
      }));

      const worksheet = XLSX.utils.json_to_sheet(flattenedData, {
        header: [
          "bookid",
          "title",
          "pageNumber",
          "height",
          "width",
          "read",
          "publicationDate",
          "wantToRead",
          "notes",
          "physical",
          "originCountry",
          "authors",
          "genres",
          "type", // Include the custom header for type
          "language", // Include the custom header for language
        ],
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Books");

      resolve(workbook);
    });
  }
}
