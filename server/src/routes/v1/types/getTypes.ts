import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Types } from "../../../entities/Types";

export const getTypes = async (req: Request, res: Response) => {
  try {
    const repoTypes = AppDataSource.getRepository(Types);
    const typesObj = await repoTypes.find();
    const types: string[] = typesObj.map((genre) => genre.name);

    res.status(200).json({ types });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};
