import { IController } from "../shared/interfaces";
import { Router } from "express";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import { FrontlineService } from "../services";
import HttpException from "../shared/exceptions/httpException";


export class FrontlineController implements IController {
    router: Router;
    route: "frontline";

    constructor(
        private frontlineService: FrontlineService
    ) {
        this.router = Router();
        this.initRoutes();
    }
    
    initRoutes() {
        this.router.get("/supporters", this.getAllRequests);
        this.router.get("/requests", this.getAllSupporters);

    }


    getAllRequests = async ({ request, response }: { request: CRequest; response: CResponse; }) => {

        try {
            const results = await this.frontlineService.getRequests(request.query)
            return results
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }


    getAllSupporters = async ({ request, response }: { request: CRequest; response: CResponse; }) => {
        try {
            const results = await this.frontlineService.getSupporters(request.query)
            return results
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }





}