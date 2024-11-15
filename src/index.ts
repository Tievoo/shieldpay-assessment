import express, { Express } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";
import walletRoutes from "./routes/wallet.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(authRoutes);
app.use("/wallets", walletRoutes);

app.get("/", (req, res) => {
  res.send("server ok");
});

app.use(errorHandler);
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});