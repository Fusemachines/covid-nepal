import { IController } from "../shared/interfaces";
import { Router, Request, Response } from "express";
import { HospitalService } from "../services";
import HttpException from "../shared/exceptions/httpException";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";


export class HospitalController implements IController {
    route: string = "hospitals"
    router: Router;

    constructor(private hospitalService: HospitalService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/", this.createHospital);
        this.router.get("/", this.getAllHospitals);
        this.router.get("/covid", this.getHospitalsForCovid);
        this.router.get("/:id", this.getHospitalById);
        this.router.patch("/:id", this.updateHospital);
        this.router.delete("/:id", this.removeHospital);
    }

    createHospital = async (request: CRequest, response: CResponse) => {
        try {
            const hospitalData = request.body;
            const hospital = await this.hospitalService.createHospital(hospitalData);

            response.status(201).json(hospital);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
            response.status(500).json({ error })
        }
    }

    updateHospital = async (request: CRequest, response: CResponse) => {
        try {
            global.logger.log({
                level: 'info',
                message: `Updaing hospital->id:${request.params.id}, body: ${JSON.stringify(request.body)}`
            });

            const result = await this.hospitalService.update(request.params.id, request.body);
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

    removeHospital = async (request: CRequest, response: CResponse) => {
        try {
            global.logger.log({
                level: 'info',
                message: `Deleting hospital->id:${request.params.id}`
            });

            const result: any = await this.hospitalService.delete(request.params.id);
            if (result === null) {
                return response.status(500).json({
                    error: "Unable to delete hospital record"
                })
            }

            return response.json({
                message: `'${result.name || ""}' removed successfully.`
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


    getAllHospitals = async (request: CRequest, response: CResponse) => {
        try {
            const docs = await this.hospitalService.getHospitals(request.query);
            response.status(200).json({ docs })
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
            response.status(500).json({ error })
        }
    }

    getHospitalsForCovid = async (request: CRequest, response: CResponse) => {
        try {
            const docs = await this.hospitalService.getCovidHospitals();
            response.status(200).json({ docs })
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
            response.status(500).json({ error })
        }
    }

    getHospitalById = async (request: CRequest, response: CResponse) => {
        const hospitalId = request.params.id;
        try {
            const hospital = await this.hospitalService.getHospitalById(hospitalId);
            response.status(200).json(hospital);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
            response.status(500).json({ error })
        }
    }
}