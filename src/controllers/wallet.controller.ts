import { Request, Response, NextFunction } from "express";
import { prisma } from "../utils/prisma";
import { ErrorType, PrismaError, prismaErrorHandler } from "../middleware/errorHandler";

// As a general rule, every time I search by id, I also search by user_id
// Even if there is a wallet with that id, if it doesn't belong to the user, I return a not found error
// If someone else tries to access your wallet, they shouldn't know if it exists or not

export const getUserWallets = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const tag = req.query.tag;

    const wallets = await prisma.wallet.findMany({
        where: { user_id: userId, tag: tag as string },
    });

    res.status(200).json(wallets);
}

export const getWallet = async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;
    const userId = req.body.userId;

    const wallet = await prisma.wallet.findUnique({
        where: { id: walletId, user_id: userId }
    });

    if (!wallet) {
        return next(ErrorType.NotFound);
    }

    res.status(200).json(wallet);
}

export const createWallet = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.body.userId;
    const { tag, chain, address } = req.body;

    if (!chain || !address) {
        return next(ErrorType.InvalidRequest);
    }

    try {
        const wallet = await prisma.wallet.create({
            data: { tag, chain, address, user_id: userId }
        });

        res.status(201).json({ message: "Wallet created" });
    } catch (error) {
        return next(prismaErrorHandler(error as PrismaError));
    }   
}

export const deleteWallet = async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;
    const userId = req.body.userId;
    try {
        await prisma.wallet.delete({
            where: { id: walletId, user_id: userId }
        });

        res.status(200).json({ message: "Wallet deleted" });
    } catch (error) {
        return next(prismaErrorHandler(error as PrismaError));
    }
}

export const updateWallet = async (req: Request, res: Response, next: NextFunction) => {
    const walletId = req.params.id;
    const { tag, chain, address } = req.body;
    const userId = req.body.userId;

    try {
        await prisma.wallet.update({
            where: { id: walletId, user_id: userId },
            data: { tag, chain, address }
        });

        res.status(200).json({ message: "Wallet updated" });
    } catch (error) {
        return next(prismaErrorHandler(error as PrismaError));
    }
}
