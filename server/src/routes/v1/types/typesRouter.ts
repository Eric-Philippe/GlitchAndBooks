import express from "express";
import { getTypes } from "./getTypes";

export const typesRouter = express.Router();

typesRouter.get("/", getTypes);
