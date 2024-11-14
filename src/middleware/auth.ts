import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface JwtPayload {
    id: string;
}

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["Authorization"] as string;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return next(new Error("Unauthorized"));
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.body.userId = decoded.id;
        next();
    } catch (error) {
        return next(new Error("Unauthorized"));
    }
};
