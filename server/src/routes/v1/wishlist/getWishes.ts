import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Wishlist } from "../../../entities/Wishlist";

export default async function getWishes(req: Request, res: Response) {
  const { userid } = req.query as { userid: string };
  if (!userid) {
    res.status(400).send("userid is required");
    return;
  }

  const wishRepo = AppDataSource.getRepository(Wishlist);

  const wishes = await wishRepo
    .createQueryBuilder("wishlist")
    .where("wishlist.userid = :userid", { userid })
    .getMany();

  res.status(200).json(wishes);
}
