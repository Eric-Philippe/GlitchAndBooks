import express from "express";
import { getGenres } from "./getGenres";

export const genresRouter = express.Router();

genresRouter.get("/", getGenres);
