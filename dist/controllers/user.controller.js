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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class UserController {
    constructor(userService) {
        this.userService = userService;
        this.route = "user";
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userService.getAllUsers();
                return res.json(result);
            }
            catch (error) {
                console.log(error);
                return express_1.response.status(500).json({
                    error
                });
            }
        });
        this.router = express_1.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/", this.getAllUsers);
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map