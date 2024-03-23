import express from "express";
import cors from "cors";
import { UserRoutes } from "./Routes/UserRoutes";
import { dbConnection, dbTermination } from "./database/db";
const app = express();
dbConnection();
app.use(express.json());
app.use(cors());
app.use(UserRoutes);

const envPort = process.env.PORT as string;
const PORT = envPort || 5000;

app.listen(PORT, () => {
  console.log("The app is up and listening on port", PORT);
});

process.on("SIGINT", async () => {
  await dbTermination();
  process.exit(0);
});
