import { Router } from "express";
import { IController } from "../shared/interfaces";
export declare class ContactController implements IController {
    route: string;
    router: Router;
    constructor();
    initRoutes(): void;
}
