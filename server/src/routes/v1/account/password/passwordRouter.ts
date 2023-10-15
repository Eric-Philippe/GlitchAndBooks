import express from "express";

import { forgotPassword, isValidToken, resetPassword } from "./forgotPassword";
import { jwtTokenVerification } from "../../../../middlewares/jwt";
import { changePassword } from "./changePassword";

export const passwordRouter = express.Router();

passwordRouter.post("/forgot", forgotPassword);
passwordRouter.post("/isvalidtoken", isValidToken);
passwordRouter.post("/reset", resetPassword);
passwordRouter.post("/change", jwtTokenVerification, changePassword);
