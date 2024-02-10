import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";

import { WishI } from "../../../models/WishI";
import { Wishlist } from "../../../entities/Wishlist";
import { Users } from "../../../entities/Users";

export default async function addWish(req: Request, res: Response) {
  const { wish, userid } = req.body as {
    wish: WishI;
    userid: string;
  };

  try {
    const repoWish = AppDataSource.getRepository(Wishlist);
    const repoUser = AppDataSource.getRepository(Users);

    // Check if a wish with the same title and the same editor already exists
    const wishExists = await repoWish.findOneBy({
      title: wish.title,
      editor: wish.editor,
    });

    if (wishExists) {
      res.status(409).send("Wish already exists");
      return;
    }

    const user = await repoUser.findOneBy({ userid: parseInt(userid) });

    const newWish = new Wishlist();
    newWish.title = wish.title;
    newWish.author = wish.author;
    newWish.price = wish.price;
    newWish.editor = wish.editor;
    newWish.user = user;

    await repoWish.save(newWish);

    res.status(201).send("Wish added");
  } catch (error) {
    res.status(500).send("Error while adding wish");
  }
}
