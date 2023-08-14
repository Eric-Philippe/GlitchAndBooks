import * as express from "express";
import { login } from "./login/login";
import { session } from "./session/session";
import { booksRouter } from "./books/booksRouter";
import { jwtTokenVerification } from "../../middlewares/jwt";

export const v1Routes = express.Router();

//v1Routes.use("/authors", authRouter);
v1Routes.post("/login", login);
v1Routes.get("/session", session);

v1Routes.use("/books", jwtTokenVerification, booksRouter);
