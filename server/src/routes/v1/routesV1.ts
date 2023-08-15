import * as express from "express";
import { login } from "./login/login";
import { session } from "./session/session";
import { booksRouter } from "./books/booksRouter";
import { jwtTokenVerification } from "../../middlewares/jwt";
import { genresRouter } from "./genres/genresRouter";
import { typesRouter } from "./types/typesRouter";
import { languagesRouter } from "./languages/languagesRouter";
import { countryRouter } from "./country_origin/countryRouter";

export const v1Routes = express.Router();

/** Session Routers */
v1Routes.post("/login", login);
v1Routes.get("/session", session);

/** Open API access Routers */
v1Routes.use("/languages", languagesRouter);
v1Routes.use("/countries", countryRouter);
v1Routes.use("/genres", genresRouter);
v1Routes.use("/types", typesRouter);

/** Restricted API Access Routers */
v1Routes.use("/books", jwtTokenVerification, booksRouter);
