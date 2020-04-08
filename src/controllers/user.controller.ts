import { Router, Request, Response, response } from "express";
import { IController } from "../shared/interfaces";
import { UserService } from "../services";
import { UserModel } from "../models/user.model";


export class UserController implements IController {
    public route: string = "user";
    public router: Router;


    constructor(private userService: UserService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.getAllUsers);
    }


    getAllUsers = async (req: Request, res: Response) => {
        try {
            const result =  await this.userService.getAllUsers();
            return res.json(result);
        } catch (error) {
            console.log(error);
            return response.status(500).json({
                error
            })
        }
    }
}