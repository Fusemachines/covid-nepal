import App from "./app";
import {
    json,
    urlencoded,
} from "express";
import { config } from "dotenv";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services";
import { ContactController } from "./controllers";

config();

const app = new App({
    controllers: [
        new UserController(new UserService()),
        new ContactController()
    ],
    middlewares: [
        json(),
        urlencoded({
            extended: true
        })
    ],
    port: 5000
})

app.run(() => {
    console.log("Server running on port", app.port)
})

