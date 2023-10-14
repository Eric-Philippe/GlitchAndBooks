import { Request, Response } from "express";
import { AppDataSource } from "../../../../data-source";
import { Users } from "../../../../entities/Users";

import TokenResetPass, {
  TIME_BEFORE_EXPIRATION,
} from "../../../../core/account/TokenResetPass";
import { SERVER_ADDRESS } from "../../../../env";

import { Mailer, MailOptions } from "../../../../mailer";

import { crypter } from "../../../../middlewares/crypter";

export const forgotPassword = async (req: Request, res: Response) => {
  const { mail } = req.body;

  const users = await AppDataSource.getRepository(Users).findBy({
    email: mail,
  });

  const user = users[0];

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const token = TokenResetPass.getInstance().generate(mail);
  const url = `${SERVER_ADDRESS}/resetpassword?token=${token}`;

  /** Get the time to a human readable
   * @WARNING: It's only made for < 1 hour
   */
  const time = new Date(TIME_BEFORE_EXPIRATION);
  const minutes = time.getUTCMinutes();
  const timeHumanReadable = `${minutes} minutes`;

  const txtEmail = `Hello ${user.username}! \n\n You requested a password reset. \n\n Please click on the following link to reset your password: \n\n ${url} \n\n The link will expire in ${timeHumanReadable}. \n\n If you did not request this, please ignore this email and your password will remain unchanged. \n\n Best regards, \n\n Glitch&Books Team`;

  const mailOptions: MailOptions = {
    subject: "Glitch&Books - Reset Password",
    to: mail,
    text: txtEmail,
  };

  try {
    const resMailer = await Mailer.getInstance().sendMail(mailOptions);

    if (resMailer === 200) {
      return res.status(200).json({
        message: "Email sent",
      });
    } else {
      return res.status(500).json({
        message: "Internal server error",
      });
    }
  } catch (err) {}
};

export const isValidToken = async (req: Request, res: Response) => {
  const { token } = req.body;

  const tokenManager = TokenResetPass.getInstance();
  const isValid = tokenManager.has(token);

  if (isValid) {
    const attachedEmail = tokenManager.getEmail(token);

    const users = await AppDataSource.getRepository(Users).findBy({
      email: attachedEmail,
    });

    const user = users[0];

    return res.status(200).json({
      message: "Valid token",
      user: {
        id: user.userid,
        username: user.username,
        email: user.email,
      },
    });
  } else {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  const tokenManager = TokenResetPass.getInstance();

  // Check if token is valid
  const isValid = tokenManager.has(token);

  if (isValid) {
    // Get email attached to token
    const attachedEmail = tokenManager.getEmail(token);

    // Find user with attached email
    const users = await AppDataSource.getRepository(Users).findBy({
      email: attachedEmail,
    });

    const user = users[0];

    // Check if the old password is the same as the new one
    const isSamePassword = await crypter.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from the old one",
      });
    }

    // Change password
    user.password = await crypter.hash(newPassword);

    // Save changes
    await AppDataSource.getRepository(Users).save(user);

    // Delete token
    tokenManager.remove(token);

    return res.status(200).json({
      message: "Password changed",
    });
  } else {
    return res.status(400).json({
      message: "Invalid token",
    });
  }
};
