import * as express from "express";
import { login } from "./login/login";
import { session } from "./session/session";

export const v1Routes = express.Router();

//v1Routes.use("/authors", authRouter);
v1Routes.post("/login", login);
v1Routes.get("/session", session);
