import express from "express";

import { forgotPassword, isValidToken, resetPassword } from "./forgotPassword";

export const passwordRouter = express.Router();

passwordRouter.post("/forgot", forgotPassword);
passwordRouter.post("/isvalidtoken", isValidToken);
passwordRouter.post("/reset", resetPassword);
