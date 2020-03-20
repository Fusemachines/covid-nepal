"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
class App {
    constructor({ controllers, middlewares, port }) {
        this.app = express_1.default();
        this.port = port;
        this.createDatabaseConnection({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10)
        });
        this.middlewares(middlewares);
        this.initRoutes(controllers);
    }
    createDatabaseConnection(connOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let connectionUri = `mongodb://${connOptions.username || ''}:${connOptions.password || ''}@${connOptions.host}:${connOptions.port}/${connOptions.database}`;
                yield mongoose_1.connect(connectionUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
            }
            catch (error) {
                console.log("Error connecting to database");
                console.log(error);
            }
        });
    }
    initRoutes(controllers) {
        this.app.get('/', function (req, res) {
            res.send("Server running");
        });
        controllers.forEach(controller => {
            this.app.use(`/${controller.route}`, controller.router);
        });
    }
    middlewares(middlewares) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }
    run(cb) {
        this.app.listen(this.port, cb);
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map