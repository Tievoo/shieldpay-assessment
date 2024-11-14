import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";

export const getUserWallets = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;

    const wallets = await prisma.wallet.findMany({
        where: { user_id: userId }
    });

    res.status(200).json(wallets);
}

export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;

    const wallet = await prisma.wallet.findUnique({
        where: { id: walletId }
    });

    if (!wallet) {
        return next(new Error("Not Found"));
    }

    res.status(200).json(wallet);
}

export const createWallet = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const { tag, chain, address } = req.body;

    if (!chain || !address) {
        return next(new Error("Invalid request"));
    }

    const wallet = await prisma.wallet.create({
        data: {
            tag,
            chain,
            address,
            user_id: userId
        }
    });

    res.status(201).json(wallet);
}

export const deleteWallet = async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;

    await prisma.wallet.delete({
        where: { id: walletId }
    }).catch(() => {
        return next(new Error("Not Found"));
    });

    res.status(200).json({ message: "Wallet deleted" });
}

export const updateWallet = async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;
    const { tag, chain, address } = req.body;

    await prisma.wallet.update({
        where: { id: walletId },
        data: { tag, chain, address }
    }).catch(() => {
        return next(new Error("Not Found"));
    });

    res.status(200).json({ message: "Wallet updated" });
}
