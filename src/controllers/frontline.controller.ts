import { IController } from "../shared/interfaces";
import { Router } from "express";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import { FrontlineService } from "../services";
import HttpException from "../shared/exceptions/httpException";
import { validateCreateRequest, validateCreateSupporter } from "../request_validations/frontline.validation";

export class FrontlineController implements IController {
    route: string = "frontline";
    router: Router;

    constructor(
        private frontlineService: FrontlineService
    ) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/supporters", this.getAllSupporters);
        this.router.get("/requests", this.getAllRequests);

        this.router.post("/supporters", validateCreateSupporter, this.createSupporter);
        this.router.post("/requests", validateCreateRequest, this.createRequest);
        
    }


    createSupporter = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.createSupporter(request.body)
            response.status(201).json(result)
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }

    }

    createRequest = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.createRequest(request.body)
            response.status(201).json(result)
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }

    }


    getAllRequests = async (request: CRequest, response: CResponse) => {

        try {
            const results = await this.frontlineService.getRequests(request.query)

            response.status(200).json(results);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }


    getAllSupporters = async (request: CRequest, response: CResponse) => {
        try {
            const results = await this.frontlineService.getSupporters(request.query)
            response.status(200).json(results);
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