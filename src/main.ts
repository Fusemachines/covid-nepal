import App from "./app";
import {
    json,
    urlencoded,
} from "express";
import { config } from "dotenv";
import { UserController } from "./controllers/user.controller";
import { LiveDataController } from "./controllers/livedata.controller";
import { UserService, LiveDataService } from "./services";
import { ContactController } from "./controllers";

config();

const app = new App({
    controllers: [
        new UserController(new UserService()),
        new LiveDataController(new LiveDataService()),
        new ContactController(),
    ],
    middlewares: [
        json(),
        urlencoded({
            extended: true
        })
    ],
    port: parseInt(process.env.APP_PORT, 10)
})

app.run(() => {
    console.log("Server running on port", app.port)
})

