import App from "./app";
import {
    json,
    urlencoded,
} from "express";
import { config } from "dotenv";
import { resolve } from "path";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services";
import { ContactController, VirusCountController } from "./controllers";
import LoggerMiddleware from "./middlewares/loggerMiddleware";
import { VirusCountService } from "services/virus-count.service";

const environment = process.env.NODE_ENV;

const { error } = config({
    path: resolve(__dirname, "../", `.env.${environment}`)
});


if (error) {
    throw new Error(error.message);
}

const app = new App({
    controllers: [
        new UserController(new UserService()),
        new ContactController(),
        new VirusCountController(new VirusCountService())
    ],
    middlewares: [
        json(),
        urlencoded({
            extended: true
        }),
        LoggerMiddleware
    ],
    port: process.env.APP_PORT
})

app.run(() => {
    console.log(`Server running on port in ${environment} mode`);
})

