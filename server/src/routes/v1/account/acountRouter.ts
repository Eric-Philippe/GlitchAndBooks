import express from "express";

import login from "./login";
import create from "./createAccount";
import { passwordRouter } from "./password/passwordRouter";

export const accountRouter = express.Router();

accountRouter.post("/login", login);
accountRouter.post("/create", create);
accountRouter.use("/password", passwordRouter);
