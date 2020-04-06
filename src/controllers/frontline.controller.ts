import { IController } from "../shared/interfaces";
import { Router } from "express";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import { FrontlineService } from "../services";
import HttpException from "../shared/exceptions/httpException";
import { validateCreateRequest, validateCreateSupporter, validateUpdateSupporter, validateUpdateRequest } from "../request_validations/frontline.validation";

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
        this.router.get("/supporters/dropdown", this.getDropdownSupporters);

        this.router.get("/supporters/:id", this.getSupporterById);
        this.router.get("/requests/:id", this.getRequestById);

        this.router.post("/supporters", validateCreateSupporter, this.createSupporter);
        this.router.post("/requests", validateCreateRequest, this.createRequest);

        this.router.patch("/supporters/:id", validateUpdateSupporter, this.updateSupporterById);
        this.router.patch("/requests/:id", validateUpdateRequest, this.updateRequestById);

        this.router.delete("/requests/:id", this.deleteRequestById);
        this.router.delete("/supporters/:id", this.deleteSupporterById);
    }

    deleteRequestById = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.deleteRequestById(request.params.id)
            if (!result) {
                throw new Error("NOT_FOUND")
            }
            response.status(200).json({
                message: `${result.get("name")} removed successfully`
            });
        } catch (error) {
            if (error.message === "NOT_FOUND") {
                error.message = "Request does not exist";
                return this.handleError(404, error, response);
            }
            this.handleError(500, error, response);
        }
    }

    deleteSupporterById = async (request: CRequest, response: CResponse) => {

        try {
            const result = await this.frontlineService.deleteSupporterById(request.params.id)
            if (!result) {
                throw new Error("NOT_FOUND")
            }
            response.status(200).json({
                message: `${request.get("name")} removed successfully`
            });
        } catch (error) {
            if (error.message === "NOT_FOUND") {
                error.message = "Supporter does not exist";
                return this.handleError(404, error, response);
            }
            this.handleError(500, error, response);
        }
    }


    createSupporter = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.createSupporter(request.body)
            response.status(201).json(result)
        } catch (error) {
            this.handleError(500, error, response);
        }
    }

    createRequest = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.createRequest(request.body)
            response.status(201).json(result)
        } catch (error) {
            this.handleError(500, error, response);
        }
    }

    updateSupporterById = async (request: CRequest, response: CResponse) => {
        try {
            const updateResult = await this.frontlineService.updateSupporter(request.params.id, request.body)
            response.status(200).json(updateResult);
        } catch (error) {
            this.handleError(500, error, response);
        }
    }

    updateRequestById = async (request: CRequest, response: CResponse) => {
        try {
            const updateResult = await this.frontlineService.updateRequest(request.params.id, request.body);
            response.status(200).json(updateResult);
        } catch (error) {
            this.handleError(500, error, response);
        }
    }


    getAllRequests = async (request: CRequest, response: CResponse) => {
        try {
            const results = await this.frontlineService.getRequests(request.query);
            response.status(200).json(results);
        } catch (error) {
            this.handleError(500, error, response);
        }
    }

    getAllSupporters = async (request: CRequest, response: CResponse) => {
        try {
            const results = await this.frontlineService.getSupporters(request.query)
            response.status(200).json(results);
        } catch (error) {
            this.handleError(500, error, response)
        }
    }

    getSupporterById = async (request: CRequest, response: CResponse) => {

        try {
            const result = await this.frontlineService.getSupporterById(request.params.id)
            if (!result) {
                throw new Error("NOT_FOUND")
            }
            response.status(200).json(result);
        } catch (error) {
            if (error.message === "NOT_FOUND") {
                error.message = "Supporter does not exist";
                return this.handleError(404, error, response);
            }
            this.handleError(500, error, response);
        }
    }

    getRequestById = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.frontlineService.getRequestById(request.params.id);
            if (!result) {
                throw new Error("NOT_FOUND")
            }
            response.status(200).json(result);
        } catch (error) {
            if (error.message === "NOT_FOUND") {
                error.message = "Request does not exist"
                return this.handleError(404, error, response);
            }
            this.handleError(500, error, response);
        }
    }

    getDropdownSupporters = async (request: CRequest, response: CResponse) => {
        try {
            const results = await this.frontlineService.getSupportersForDropdown();
            response.status(200).send(results);
        } catch (error) {
            this.handleError(500, error, response);
        }
    }

    handleError(code: number, error: any, response: CResponse) {
        error = new HttpException({
            statusCode: code,
            description: error.message,
        });
        const parsedError = error.parse();
        response.status(parsedError.statusCode).json(parsedError);
    }





}