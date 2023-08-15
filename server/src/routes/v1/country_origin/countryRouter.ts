import express from "express";
import { getCountry } from "./getCountry";

export const countryRouter = express.Router();

countryRouter.get("/", getCountry);
