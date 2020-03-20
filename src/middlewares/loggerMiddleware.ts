import logger from "../shared/logger"

// TODO add winston logger



const LoggerMiddleware = function (req: Request, res: Response) {
    const message = `[${req.method}] ${req.url} ${JSON.stringify(req.body)}`;
    logger.log({
        level: "info",
        message
    })
}

export default LoggerMiddleware;