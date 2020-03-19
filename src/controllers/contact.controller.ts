import { Router, Request, Response, response } from "express";
import { IController } from "../shared/interfaces";
import { UserService } from "../services";


export class ContactController implements IController {
    public route: string = "contact";
    public router: Router;

    constructor() {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", function (req, res) {
            res.json([{
                name: "Contact 1",
                phone: "984112311"
            }])
        });
    }

}