import * as bcrypt from "bcrypt";

const saltRounds = 10;

export const crypter = {
  hash: (password: string) => bcrypt.hash(password, saltRounds),
  compare: (password: string, hash: string) => bcrypt.compare(password, hash),
};
