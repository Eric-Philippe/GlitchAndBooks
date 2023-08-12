import { Request, Response } from "express";
import { AppDataSource } from "../../../data-source";
import { Users } from "../../../entities/Users";

export const login = async (req: Request, res: Response) => {
  // Get the username and password from the request body
  let { username, password } = req.body;

  if (!username) username = "";
  if (!password) password = "";

  // Validate the username and password are not empty
  const repo = AppDataSource.getRepository(Users);
  const login = await repo.findBy({
    username: username,
    password: password,
  });

  console.log(username, password);

  if (login.length > 0) {
    res.status(200).json({
      message: "Login successful",
      data: login,
    });
  } else {
    res.status(401).json({
      message: "Invalid username or password",
    });
  }
};
