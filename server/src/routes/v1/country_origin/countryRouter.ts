import express from "express";
import { getCountriesWithCode, getCountry } from "./getCountry";

export const countryRouter = express.Router();

countryRouter.get("/", getCountry);
countryRouter.get("/withcode", getCountriesWithCode);
