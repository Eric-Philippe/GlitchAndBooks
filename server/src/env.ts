require("dotenv").config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, PORT, JWT_SECRET } =
  process.env;

if (!DB_HOST || !DB_PORT || !DB_USER || !DB_PASS || !DB_NAME || !JWT_SECRET) {
  throw new Error("Missing environment variables");
}

const DB_URL = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export {
  DB_URL,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  PORT,
  JWT_SECRET,
};
