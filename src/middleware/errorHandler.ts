import { Request, Response, NextFunction } from "express";

export interface PrismaError {
    message: string;
    code: PrismaErrorCodes;
    meta: PrismaErrorMeta;
}

interface PrismaErrorMeta {
    modelName: string;
    target: string[];
}

export enum ErrorType {
    Unauthorized = "Unauthorized",
    NotFound = "Not Found",
    InvalidRequest = "Invalid Request",
    InternalServerError = "Internal Server Error",
    UserAlreadyExists = "User already exists",
    InvalidCredentials = "Invalid credentials",
    WalletAlreadyExists = "Wallet already exists",
}

export enum PrismaErrorCodes {
    UniqueConstraintFailed = "P2002",
    RecordNotFound = "P2025",
}

export const prismaErrorMap : Record<PrismaErrorCodes, (meta : PrismaErrorMeta) => ErrorType> = {
    [PrismaErrorCodes.UniqueConstraintFailed]: (meta) => `${meta.modelName} already exists` as ErrorType,
    [PrismaErrorCodes.RecordNotFound]: () => ErrorType.NotFound
}

const errorMap = {
    [ErrorType.Unauthorized]: 401,
    [ErrorType.NotFound]: 404,
    [ErrorType.InvalidRequest]: 400,
    [ErrorType.InternalServerError]: 500,
    [ErrorType.UserAlreadyExists]: 409,
    [ErrorType.InvalidCredentials]: 401,
    [ErrorType.WalletAlreadyExists]: 409,
}

export const prismaErrorHandler = (error: PrismaError) : ErrorType => {
    return prismaErrorMap[error.code]?.(error.meta) || ErrorType.InternalServerError;
}

export const errorHandler = (err: string, req: Request, res: Response, next: NextFunction) => {
    res.status(errorMap[err as ErrorType] || 500).json({ error: err });
};
