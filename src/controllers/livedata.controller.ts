import { Router } from "express";
import { IController } from "../shared/interfaces";
import { LiveDataService } from "../services";
import HttpException from "../shared/exceptions/httpException";
import { CRequest, CResponse } from "shared/interfaces/http.interface";

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

    all = async (request: CRequest, response: CResponse) => {
        try {
            global.logger.log({
                level: 'info',
                message: `Getting all livedata`
            });

            const result =  await this.liveDataService.all(request.query);
            return response.json({
                docs: result
            });

        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
    }

    create = async (request: CRequest, response: CResponse) => {
        try {
            global.logger.log({
                level: 'info',
                message: `Creating live data -> body: ${JSON.stringify(request.body)}`
            });

            const result =  await this.liveDataService.create(request.body);
            return response.json(result);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
    }

    update = async (request: CRequest, response: CResponse) => {
        try {
            global.logger.log({
                level: 'info',
                message: `Updaing livedata->id:${request.params.id}, body: ${JSON.stringify(request.body)}`
            });

            const result =  await this.liveDataService.update(request.params.id, request.body);
            return response.json(result);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
    }

    delete = async (request: CRequest, response: CResponse) => {
        try {
            global.logger.log({
                level: 'info',
                message: `Deleting livedata->id:${request.params.id}`
            });

            const result:any = await this.liveDataService.delete(request.params.id);
            if (result === null) {
                return response.status(500).json({
                    error: "Unable to delete livedata record"
                })
            }

            return response.json({
                message: `'${result.nameOfHospital}' removed successfully.`
            });
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
    }
}