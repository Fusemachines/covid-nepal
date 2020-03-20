"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../shared/logger"));
// TODO add winston logger
const LoggerMiddleware = function (req, res) {
    const message = `[${req.method}] ${req.url} ${JSON.stringify(req.body)}`;
    logger_1.default.log({
        level: "info",
        message
    });
};
exports.default = LoggerMiddleware;
//# sourceMappingURL=loggerMiddleware.js.map