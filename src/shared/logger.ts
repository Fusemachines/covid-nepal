import winston from "winston";
import { createLogger, format } from "winston";

const today = new Date();
const logDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDay()

const logFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp}  ${level}: ${message}`;
});

const logger = createLogger({
    transports: [
        new (winston.transports.Console)({ level: process.env.NODE_ENV === "production" ? "error" : "debug" }),
        new (winston.transports.File)({ filename: `./logs/${logDate}-debug.log`, level: "debug" }),
        new (winston.transports.File)({ filename: `./logs/${logDate}-error.log`, level: "error" }),
        new (winston.transports.File)({ filename: `./logs/${logDate}-info.log`, level: "info" })
    ],
    silent: process.env.NODE_ENV === "production",
    ...(process.env.NODE_ENV === "development" ? {
        format: format.combine(
            format.timestamp(),
            format.colorize({
                all: true
            }),
            logFormat
        )
    } : {})
});

export default logger