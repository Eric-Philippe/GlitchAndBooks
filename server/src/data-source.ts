import "reflect-metadata";

import { DataSource } from "typeorm";
import { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } from "./env";
import { Authors } from "./entities/Authors";
import { Users } from "./entities/Users";
import { CountryOrigin } from "./entities/CountryOrigin";
import { Genres } from "./entities/Genres";
import { Languages } from "./entities/Languages";
import { Types } from "./entities/Types";
import { Wishlist } from "./entities/Wishlist";
import { Books } from "./entities/Books";

/** ORM DataSource Main Access / Setup */
export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [
    Authors,
    Books,
    CountryOrigin,
    Genres,
    Languages,
    Types,
    Users,
    Wishlist,
  ],
  migrations: [],
  subscribers: [],
});

/** Initialize the ORM DataSource */
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .catch((error) => console.log(error));
