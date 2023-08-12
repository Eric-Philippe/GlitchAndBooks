import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Users } from "../../../entities/Users";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../../../env";

export const login = async (req: Request, res: Response) => {
  // Get the username and password from the request body
  let { username, password } = req.body;

  if (!username) username = "";
  if (!password) password = "";

  try {
    // Validate the username and password against your data source (for example, a database)
    const repo = AppDataSource.getRepository(Users);
    const login = await repo.findBy({
      username: username,
      password: password,
    });

    if (login.length > 0) {
      const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;
      const token = sign({ username: username }, JWT_SECRET, {
        expiresIn: ONE_MONTH,
      });

      res.status(200).json({
        message: "Login successful",
        data: login,
        token: token,
      });
    } else {
      res.status(401).json({
        message: "Invalid username or password",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred",
    });
  }
};
