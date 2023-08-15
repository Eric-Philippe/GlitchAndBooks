import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Genres } from "../../../entities/Genres";

export const getGenres = async (req: Request, res: Response) => {
  try {
    const repoGenres = AppDataSource.getRepository(Genres);
    const genresObj = await repoGenres.find();
    const genres: string[] = genresObj.map((genre) => genre.name);

    res.status(200).json({ genres });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};
