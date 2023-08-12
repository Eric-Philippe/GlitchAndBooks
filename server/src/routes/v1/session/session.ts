import { Request, Response } from "express";
import { JWT_SECRET } from "../../../env";
import { verify } from "jsonwebtoken";

export const session = async (req: Request, res: Response) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    verify(token, JWT_SECRET);

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
