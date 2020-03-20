import logger from "../shared/logger"
import { NextFunction, Request, Response } from "express";

const LoggerMiddleware = function (request: Request, response: Response, next: NextFunction) {
    const message = `[${request.method}] ${request.url} ${JSON.stringify(request.body)}`;
    logger.log({
        level: "info",
        message
    })
    next();
}

export default LoggerMiddleware;