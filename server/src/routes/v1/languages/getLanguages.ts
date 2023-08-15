import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Languages } from "../../../entities/Languages";

export const getLanguages = async (req: Request, res: Response) => {
  try {
    const repoLanguages = AppDataSource.getRepository(Languages);
    const languagesObj = await repoLanguages.find();
    const languages: string[] = languagesObj.map((genre) => genre.langue);

    res.status(200).json({ languages });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};
