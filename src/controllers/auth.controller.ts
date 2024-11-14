import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { isEmailValid } from "../utils/isEmailValid";
import { ErrorType, PrismaError, PrismaErrorCodes, prismaErrorHandler, prismaErrorMap } from "../middleware/errorHandler";


export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    
    if (!isEmailValid(email) || !password) {
        return next(ErrorType.InvalidRequest);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        return next(prismaErrorHandler(error as PrismaError));
    }
}

export const signin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(ErrorType.InvalidRequest);
    }

    const user = await prisma.user.findUnique({
        where: { email },
    }); 

    if (!user) {
        return next(ErrorType.NotFound);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return next(ErrorType.InvalidCredentials);
    }

    const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
}

export const signout = async (req: Request, res: Response, next: NextFunction) => {
    // Creating a signout function without a frontend holding the token is kinda pointless, it doesn't do much as you can't "cancel" a token.
    res.status(200).json({ message: "Logout successful" });
}