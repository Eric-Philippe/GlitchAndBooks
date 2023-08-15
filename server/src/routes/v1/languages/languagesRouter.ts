import express from "express";
import { getLanguages } from "./getLanguages";

export const languagesRouter = express.Router();

languagesRouter.get("/", getLanguages);
