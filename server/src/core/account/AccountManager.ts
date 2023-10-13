import { AppDataSource } from "../../data-source";
import { Users } from "../../entities/Users";
import { crypter } from "../../middlewares/crypter";

/**
 * Class hosting all the methods related to the account management
 */
export default class AccountManager {
  public static async changePassword(
    username: string,
    password: string
  ): Promise<number> {
    const repo = AppDataSource.getRepository(Users);
    const user = await repo.findBy({
      username: username,
    });

    if (user.length > 0) {
      const hash = await crypter.hash(password);
      user[0].password = hash;
      await repo.save(user[0]);

      return 200;
    } else {
      return 401;
    }
  }
}
