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

    getAllHospitals = async (request: CRequest, response: CResponse) => {
        try {
            const docs = await this.hospitalService.getHospitals();
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