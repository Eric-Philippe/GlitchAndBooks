import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Users } from "../../../entities/Users";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "../../../env";
import { crypter } from "../../../middlewares/crypter";

export const createAccount = async (req: Request, res: Response) => {
  // Get the username and password from the request body
  let { username, password, mail } = req.body;

  if (!username) username = "";
  if (!password) password = "";
  if (!mail) mail = "MERDE";

  try {
    // Validate the username and password against your data source (for example, a database)
    const repo = AppDataSource.getRepository(Users);
    const findByUsername = await repo.findBy({
      username: username,
    });

    const findByEmail = await repo.findBy({
      email: mail,
    });

    if (findByUsername.length == 0) {
      if (findByEmail.length == 0) {
        const hash = await crypter.hash(password);

        const user = await repo.create({
          username: username,
          password: hash,
          email: mail,
        });

        await repo.save(user);

        const ONE_MONTH = 1000 * 60 * 60 * 24 * 30;
        const token = sign({ username: username }, JWT_SECRET, {
          expiresIn: ONE_MONTH,
        });

        res.status(200).json({
          message: "Account created",
          data: user,
          token: token,
        });
      } else {
        res.status(401).json({
          message: "Email already taken !",
        });
      }
    } else {
      res.status(401).json({
        message: "Username already taken !",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "An error occurred",
    });
  }
};
