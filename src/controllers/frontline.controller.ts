import { IController } from "../shared/interfaces";
import { Router } from "express";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import { FrontlineService } from "../services";
import HttpException from "../shared/exceptions/httpException";
import { validateCreateRequest, validateCreateSupporter, validateUpdateSupporter } from "../request_validations/frontline.validation";

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

        this.router.patch("/supporters/:id", validateUpdateSupporter, this.updateSupporter);
        this.router.patch("/requests", this.updateRequest);

    }


    createSupporter = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.createSupporter(request.body)
            response.status(201).json(result)
        } catch (error) {
            this.handleError(error, response);
        }
    }

    createRequest = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.createRequest(request.body)
            response.status(201).json(result)
        } catch (error) {
            this.handleError(error, response);
        }
    }

    updateSupporter = async (request: CRequest, response: CResponse) => {

        try {

            const updateResult = await this.frontlineService.updateSupporter(request.params.id, request.body)

            response.status(200).json(updateResult);

        } catch (error) {
            this.handleError(error, response);
        }
    }

    updateRequest = async (request: CRequest, response: CResponse) => {

    }


    getAllRequests = async (request: CRequest, response: CResponse) => {
        try {
            const results = await this.frontlineService.getRequests(request.query);
            response.status(200).json(results);
        } catch (error) {
            this.handleError(error, response);
        }
    }

    getAllSupporters = async (request: CRequest, response: CResponse) => {
        try {
            const results = await this.frontlineService.getSupporters(request.query)
            response.status(200).json(results);
        } catch (error) {
            this.handleError(error, response)
        }
    }

    handleError(error: any, response: CResponse) {
        error = new HttpException({
            statusCode: 500,
            description: error.message,
        });
        const parsedError = error.parse();
        response.status(parsedError.statusCode).json(parsedError);
    }





}