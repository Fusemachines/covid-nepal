"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const express_1 = require("express");
const dotenv_1 = require("dotenv");
const user_controller_1 = require("./controllers/user.controller");
const services_1 = require("./services");
const controllers_1 = require("./controllers");
dotenv_1.config();
const app = new app_1.default({
    controllers: [
        new user_controller_1.UserController(new services_1.UserService()),
        new controllers_1.ContactController()
    ],
    middlewares: [
        express_1.json(),
        express_1.urlencoded({
            extended: true
        })
    ],
    port: 5000
});
app.run(() => {
    console.log("Server running on port", app.port);
});
//# sourceMappingURL=main.js.map