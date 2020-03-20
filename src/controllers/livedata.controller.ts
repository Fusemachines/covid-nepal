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
        this.router.patch("/update/:id", this.update);
        this.router.delete("/delete/:id", this.delete);
    }

    all = async (request: Request, response: Response) => {
        try {
            const result =  await this.liveDataService.all(request.query);
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
            console.warn(error);
            return response.status(500).json({
                error
            })
        }
    }

    update = async (request: Request, response: Response) => {
        try {
            const result =  await this.liveDataService.update(request.params.id, request.body);
            return response.json(result);
        } catch (error) {
            console.warn(error);
            return response.status(500).json({
                error
            })
        }
    }

    delete = async (request: Request, response: Response) => {
        try {

            const result:any = await this.liveDataService.delete(request.params.id);
            if (result === null) {
                return response.status(500).json({
                    "error": "Unable to delete livedata record"
                })
            }

            return response.json({
                message: `'${result.nameOfHospital}' removed successfully.`
            });
        } catch (error) {
            console.warn(error);
            return response.status(500).json({
                error
            })
        }
    }
}