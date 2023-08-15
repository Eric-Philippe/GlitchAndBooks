import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { CountryOrigin } from "../../../entities/CountryOrigin";

export const getCountry = async (req: Request, res: Response) => {
  try {
    const repoCountry = AppDataSource.getRepository(CountryOrigin);
    const countryObj = (await repoCountry.findBy({})).sort((a, b) => {
      if (a.countryoriginid > b.countryoriginid) return 1;
      if (a.countryoriginid < b.countryoriginid) return -1;
      return 0;
    });
    const countries: string[] = countryObj.map((genre) => genre.country);

    res.status(200).json({ countries });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
};
