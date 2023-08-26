import express from "express";
import addBook from "./addBook";
import getBooks from "./getBook";
import deleteBook from "./deleteBook";

export const booksRouter = express.Router();

booksRouter.post("/add", addBook);
booksRouter.get("/get", getBooks);
booksRouter.delete("/", deleteBook);
