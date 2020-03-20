"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const winston_2 = require("winston");
const today = new Date();
const logDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDay();
const logFormat = winston_2.format.printf(({ level, message, timestamp }) => {
    return `${timestamp}  ${level}: ${message}`;
});
const logger = winston_2.createLogger(Object.assign({ transports: [
        new (winston_1.default.transports.Console)({ level: process.env.NODE_ENV === "production" ? "error" : "debug" }),
        new (winston_1.default.transports.File)({ filename: `./logs/${logDate}-debug.log`, level: "debug" }),
        new (winston_1.default.transports.File)({ filename: `./logs/${logDate}-error.log`, level: "error" }),
        new (winston_1.default.transports.File)({ filename: `./logs/${logDate}-info.log`, level: "info" })
    ], silent: process.env.NODE_ENV === "production" }, (process.env.NODE_ENV === "local" ? {
    format: winston_2.format.combine(winston_2.format.timestamp(), winston_2.format.colorize({
        all: true
    }), logFormat)
} : {})));
exports.default = logger;
//# sourceMappingURL=logger.js.map