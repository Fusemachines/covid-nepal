import { Router, Request, Response, response } from "express";
import { IController } from "../shared/interfaces";
import { LiveDataService } from "../services";


export class LiveDataController implements IController {
    public route: string = "livedata";
    public router: Router;

    constructor(private liveDataService: LiveDataService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.all);
        this.router.post("/create", this.create);
    }

    all = async (request: Request, response: Response) => {
        try {
            const result =  await this.liveDataService.all();
            return response.json({
                docs: result
            });
        } catch (error) {
            console.log(error);
            return response.status(500).json({
                error
            })
        }
    }

    create = async (request: Request, response: Response) => {
        try {
            const result =  await this.liveDataService.create(request.body);
            return response.json(result);
        } catch (error) {
            console.log(error);
            return response.status(500).json({
                error
            })
        }
    }
}