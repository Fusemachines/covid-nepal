import App from "./app";
import { json, urlencoded, } from "express";
import { config } from "dotenv";
import { resolve } from "path";
import { UserController } from "./controllers/user.controller";
import { UserService, DistrictService, HospitalService, NepalCountService, GlobalCountService, FrontlineService, NewsService } from "./services";
import { ContactController, DistrictController, HospitalController, NepalCountController, GlobalCountController, NewsController, FrontlineController } from "./controllers";

import LoggerMiddleware from "./middlewares/loggerMiddleware";
import logger from "./shared/logger"
import { ContactService } from "./services/contact.service";
import { NoticeController } from "./controllers/notice.controller";
import { NoticeService } from "./services/notice.service";

// Bootstraping Global NameSpace for NodeJS
declare global {
    namespace NodeJS {
        interface Global {
            [key: string]: any
        }
    }
}

// Configuration for evironments
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
        new ContactController(
            new ContactService()
        ),
        new DistrictController(new DistrictService()),
        new HospitalController(new HospitalService()),
        new NepalCountController(new NepalCountService()),
        new GlobalCountController(new GlobalCountService()),
        new FrontlineController(new FrontlineService()),
        new NewsController(new NewsService()),
        new NoticeController(new NoticeService()),
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
    global.logger.log({
        level: "info",
        message: `Server running in ${environment} mode`
    });
})
