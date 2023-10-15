import { Request, Response } from "express";
import { AppDataSource } from "../../../../data-source";
import { Users } from "../../../../entities/Users";

import TokenResetPass, {
  TIME_BEFORE_EXPIRATION,
} from "../../../../core/account/TokenResetPass";

import { Mailer, MailOptions } from "../../../../mailer";

import { crypter } from "../../../../middlewares/crypter";

export const changePassword = async (req: Request, res: Response) => {
  const { userid, newPassword } = req.body;

  const users = await AppDataSource.getRepository(Users).findBy({
    userid: userid,
  });

  const user = users[0];

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Check if the old password is the same as the new one
  const isSamePassword = await crypter.compare(newPassword, user.password);

  if (isSamePassword) {
    return res.status(400).json({
      message: "New password must be different from the old one",
    });
  }

  // Change password
  user.password = await crypter.hash(newPassword);

  await AppDataSource.getRepository(Users).save(user);

  const mailerInstance = Mailer.getInstance();

  const mailTxt =
    "Your password has been changed successfully on " +
    new Date().toLocaleString() +
    ".\n\n" +
    "If you did not request this change, please contact us immediately.";

  const mailOption: MailOptions = {
    to: user.email,
    subject: "Password changed",
    text: mailTxt,
  };

  mailerInstance.sendMail(mailOption);

  return res.status(200).json({
    message: "Password changed",
  });
};
