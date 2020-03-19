import { Router, Request, Response } from "express";
import { IController } from "../shared/interfaces";
import { UserService } from "../services";
export declare class UserController implements IController {
    private userService;
    route: string;
    router: Router;
    constructor(userService: UserService);
    initRoutes(): void;
    getAllUsers: (req: Request<import("express-serve-static-core").ParamsDictionary>, res: Response<any>) => Promise<Response<any>>;
}
