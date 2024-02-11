import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Wishlist } from "../../../entities/Wishlist";

export default async function deleteWish(req: Request, res: Response) {
  const { wishId } = req.body as { wishId: string };

  if (!wishId) {
    res.status(400).json({ message: "Wish id is required" });
    return;
  }

  try {
    const repoWish = AppDataSource.getRepository(Wishlist);

    const wish = await repoWish.findOne({
      where: { wishlistid: parseInt(wishId) },
    });

    if (!wish) {
      res.status(404).json({ message: "Wish not found" });
      return;
    }

    await repoWish.remove(wish);

    res.status(200).json({ message: "Wish deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting the wish" });
  }
}
