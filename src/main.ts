import App from "./app";
import {
    json,
    urlencoded,
} from "express";
import { config } from "dotenv";
import { resolve } from "path";
import { UserController } from "./controllers/user.controller";
import { LiveDataController } from "./controllers/livedata.controller";
import { UserService, LiveDataService, DistrictService, VirusCountService } from "./services";
import { ContactController, VirusCountController, DistrictController } from "./controllers";
import LoggerMiddleware from "./middlewares/loggerMiddleware";
import logger from "./shared/logger"
import { ContactService } from "./services/contact.service";

// Bootstraping Global NameSpace for NodeJS
declare global {
    namespace NodeJS {
        interface Global {
            [key: string]: any
        }
    }
}

// Configuration
const environment = process.env.NODE_ENV;
const { error } = config({
    path: resolve(__dirname, "../", `.env.${environment}`)
});
if (error) throw new Error(error.message);

// Global Logger
global.logger = logger;

const app = new App({
    controllers: [
        new UserController(new UserService()),
        new LiveDataController(new LiveDataService()),
        new VirusCountController(new VirusCountService()),
        new ContactController(
            new ContactService()
        ),
        new DistrictController(new DistrictService())
    ],
    middlewares: [
        json(),
        urlencoded({
            extended: true
        }),
        LoggerMiddleware
    ],
    port: Number(process.env.APP_PORT)
})

app.run(() => {
    console.log(`Server running on port in ${environment} mode`);
})

