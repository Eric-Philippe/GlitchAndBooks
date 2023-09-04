import fs from "fs";
import PDFDocument from "pdfkit";
import { Books } from "../../entities/Books";
import { DataToFile } from "./DataToFile";

export class DataToPdf extends DataToFile {
  protected extension: string = ".pdf";

  async save(): Promise<string | null> {
    await this.fetchData(this.userId);

    const fileName = this.getFileName();
    const fullFilePath = `${this.folderPath}${fileName}`;

    try {
      const pdfContent = await this.generatePdf(this.bookData, fullFilePath);
      return pdfContent ? fullFilePath : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private generatePdf(data: Books[], filePath: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const pdfDoc = new PDFDocument();
      const stream = fs.createWriteStream(filePath);

      // Create a new PDF document and stream it to the file
      pdfDoc.pipe(stream);

      // Add content to the PDF based on your specific layout and data structure
      data.forEach((book) => {
        for (const key in book) {
          if (book.hasOwnProperty(key) && key !== "user") {
            if (key === "countryorigin" && book[key]) {
              pdfDoc.text(`Country Origin: ${book[key].country}`);
            } else if (key === "languages" && book[key]) {
              pdfDoc.text(`Language: ${book[key].langue}`);
            } else if (key === "types" && book[key]) {
              pdfDoc.text(`Type: ${book[key].name}`);
            } else if (key === "genres" && book[key]) {
              const genreNames = book[key]
                .map((genre) => genre.name)
                .join(", ");
              pdfDoc.text(`Genres: ${genreNames}`);
            } else if (key === "authors" && book[key]) {
              const authorNames = book[key]
                .map((author) => `${author.firstname} ${author.lastname}`)
                .join(", ");
              pdfDoc.text(`Authors: ${authorNames}`);
            } else {
              pdfDoc.text(`${key}: ${book[key]}`);
            }
          }
        }
        pdfDoc.text("\n"); // Add a new line between books
      });

      // End the PDF document and close the stream
      pdfDoc.end();
      stream.on("finish", () => {
        resolve(true);
      });
      stream.on("error", (error) => {
        reject(error);
      });
    });
  }
}
