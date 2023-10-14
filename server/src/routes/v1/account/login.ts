import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Users } from "../../../entities/Users";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../../../env";
import { crypter } from "../../../middlewares/crypter";

export default async function login(req: Request, res: Response) {
  // Get the username and password from the request body
  let { username, password } = req.body;

  if (!username) username = "";
  if (!password) password = "";

  try {
    // Validate the username and password against your data source (for example, a database)
    const repo = AppDataSource.getRepository(Users);
    const loginByUsername = await repo.findBy({
      username: username,
    });

    const loginByEmail = await repo.findBy({
      email: username,
    });

    if (loginByUsername.length > 0 || loginByEmail.length > 0) {
      const login = loginByUsername.length > 0 ? loginByUsername : loginByEmail;

      const goodPassword = await crypter.compare(password, login[0].password);

      if (!goodPassword) {
        res.status(401).json({
          message: "Invalid password !",
        });
        return;
      }

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
        message: "Invalid username !",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred",
    });
  }
}
