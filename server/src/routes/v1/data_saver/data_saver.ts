import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";

import { saveData } from "../../../core/datasaver/DataSaverFactory";

export const data_saver = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const downloadFormat = req.body.format;

    const filePath = await saveData(userId, downloadFormat);
    const filePathResolved = path.resolve(filePath);
    const fileName = filePath.split("/").pop();

    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.sendFile(filePathResolved);

    setTimeout(async () => {
      await fs.unlink(filePathResolved);
    }, 5000);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
