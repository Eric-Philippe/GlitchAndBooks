import { Request, Response } from "express";
import fs from "fs";

import { saveData } from "../../../core/datasaver/DataSaverFactory";

export const data_saver = async (req: Request, res: Response) => {
  const { userId, extension } = req.query as {
    userId: string;
    extension: Extensions;
  };

  const filePath = await saveData(userId, extension);
  const fileName = filePath.split("/").pop();

  res.download(filePath, fileName, (err) => {
    if (err) console.log(err);
    else fs.unlinkSync(filePath);
  });
};
