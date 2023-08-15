import express from "express";
import addBook from "./addBook";
import getBooks from "./getBook";

export const booksRouter = express.Router();

booksRouter.post("/add", addBook);
booksRouter.get("/get", getBooks);
