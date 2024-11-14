import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { ErrorType } from "./errorHandler";

interface JwtPayload {
    id: string;
}

export const auth = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"] as string;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next(ErrorType.Unauthorized);
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        return next(ErrorType.Unauthorized);
    }
};
