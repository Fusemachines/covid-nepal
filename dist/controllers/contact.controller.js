"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ContactController {
    constructor() {
        this.route = "contact";
        this.router = express_1.Router();
        this.initRoutes();
    }
    initRoutes() {
        this.router.get("/", function (req, res) {
            res.json([{
                    name: "Contact 1",
                    phone: "984112311"
                }]);
        });
    }
}
exports.ContactController = ContactController;
//# sourceMappingURL=contact.controller.js.map