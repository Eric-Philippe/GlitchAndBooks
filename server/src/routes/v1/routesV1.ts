import * as express from "express";
import { session } from "./session/session";
import { booksRouter } from "./books/booksRouter";
import { jwtTokenVerification } from "../../middlewares/jwt";
import { genresRouter } from "./genres/genresRouter";
import { typesRouter } from "./types/typesRouter";
import { languagesRouter } from "./languages/languagesRouter";
import { countryRouter } from "./country_origin/countryRouter";
import { data_saver } from "./data_saver/data_saver";
import { accountRouter } from "./account/acountRouter";
import { wishesRouter } from "./wishlist/wishesRouter";

export const v1Routes = express.Router();

/** Session Routers */
v1Routes.use("/account", accountRouter);
v1Routes.get("/session", session);

/** Open API access Routers */
v1Routes.use("/languages", languagesRouter);
v1Routes.use("/countries", countryRouter);
v1Routes.use("/genres", genresRouter);
v1Routes.use("/types", typesRouter);
v1Routes.post("/data_saver", jwtTokenVerification, data_saver);

/** Restricted API Access Routers */
v1Routes.use("/books", jwtTokenVerification, booksRouter);
v1Routes.use("/wishes", jwtTokenVerification, wishesRouter);
