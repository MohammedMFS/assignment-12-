import express from "express";
import bootstrab from "./app.controller.js";
import { ConnectDB } from "./src/DB/connection.js";
import dotenv from "dotenv";


dotenv.config({ path: "./src/config/.env.dev" });

const app = express();


const port = process.env.PORT;
console.log("PORT from env:", port);

bootstrab(app, express);

app.listen(port, () => {
  console.log(`✅ Server running at port ${port}`);
});
