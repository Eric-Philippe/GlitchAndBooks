import csv from "csv";
import fs from "fs";

import { DataToFile } from "./DataToFile";
import { Books } from "../../entities/Books";

export class DataToCsv extends DataToFile {
  protected extension: string = ".csv";

  async save(): Promise<string | null> {
    await this.fetchData(this.userId);

    const fileName = this.getFileName();
    const fullFilePath = `${this.folderPath}${fileName}`;

    try {
      const csvContent = await this.convertToCsv(this.bookData);
      fs.writeFileSync(fullFilePath, csvContent);

      return fullFilePath;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  private convertToCsv(data: Books[]): Promise<string> {
    return new Promise((resolve, reject) => {
      csv.stringify(data, { header: true }, (error, output) => {
        if (error) {
          reject(error);
        } else {
          resolve(output);
        }
      });
    });
  }
}
