import { Router } from "express";
import { getUserWallets, getWallet, createWallet, deleteWallet, updateWallet } from "../controllers/wallet.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.use(auth);

router.get("/", getUserWallets);
router.get("/:id", getWallet);

router.post("/", createWallet);

router.delete("/:id", deleteWallet);

router.put("/:id", updateWallet);

export default router;

