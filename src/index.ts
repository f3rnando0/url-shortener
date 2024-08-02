import express from "express";
import cors from "cors";
import { router } from "./app/router";
import { env } from "./env/env";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(env.data.PORT, () => {
  console.log(`{LOGS} listening on port ${env.data.PORT}`);
});
