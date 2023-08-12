import express, { Express } from "express";
import { routes } from "./routes/routes";
import cors from "cors";
//import corsMiddleware from "./middleware/cors.js";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import { PORT } from "./env";

import { AppDataSource } from "./data-source";
AppDataSource;

dotenv.config();
const app: Express = express();

// Allow any method from any host and log requests
//app.use(corsMiddleware);

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle POST requests that come in formatted as JSON
app.use(express.json());
app.use("/api", routes);

const port = PORT || 3000;
app.listen(port, () => {
  console.log("App running on port ", port);
});
