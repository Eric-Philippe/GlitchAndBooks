import express from "express";
import addBook from "./addBook";

export const booksRouter = express.Router();

booksRouter.post("/add", addBook);
