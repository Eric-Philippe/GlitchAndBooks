import express from "express";
import getWishes from "./getWishes";
import addWish from "./addWish";
import deleteWish from "./deleteWish";

export const wishesRouter = express.Router();

wishesRouter.get("/get", getWishes);
wishesRouter.post("/add", addWish);
wishesRouter.delete("/delete", deleteWish);
