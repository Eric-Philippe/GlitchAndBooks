import fs from "fs";

import { DataToFile } from "./DataToFile";

export class DataToJson extends DataToFile {
  protected extension: string = ".json";

  async save(): Promise<string | null> {
    await this.fetchData(this.userId);

    const jsonContent = JSON.stringify(this.bookData, null, 2);
    const fileName = this.getFileName();
    const fullFilePath = `${this.folderPath}${fileName}`;

    try {
      fs.writeFileSync(fullFilePath, jsonContent);

      return fullFilePath;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
