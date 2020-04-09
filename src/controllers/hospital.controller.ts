import { IController } from "../shared/interfaces";
import { Router } from "express";
import { HospitalService } from "../services/hospital.service";
import HttpException from "../shared/exceptions/httpException";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import validateHospital, {validateHospitalTag} from "../request_validations/hospital.validation";

export class HospitalController implements IController {
    route: string = "hospitals"
    router: Router;

    constructor(private hospitalService: HospitalService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {

        // hospital tag routes
        this.router.get("/tags", this.getTags);
        this.router.post("/tags", validateHospitalTag, this.createHospitalTag);
        this.router.delete("/tags/:name", this.removeHospitalTag);

        this.router.post("/", validateHospital, this.createHospital);
        this.router.get("/", this.getAllHospitals);
        this.router.get("/count", this.getHospitalCount);
        this.router.get("/covid", this.getHospitalsForCovid);
        this.router.get("/:nameSlug", this.getHospitalBySlug);
        this.router.get("/id/:id", this.getHospitalById);
        this.router.put("/:id", validateHospital, this.updateHospital);
        // this.router.patch(":/id", validateHospital, this.updateHospital)
        this.router.delete("/:id", this.removeHospital);
    }

    getHospitalById = async (request: CRequest, response: CResponse) => {

        try {
            const result = await this.hospitalService.getHospitalById(request.params.id);
            response.status(200).json(result);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
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


    getHospitalCount = async (request: CRequest, response: CResponse) => {
        try {

            const result = await this.hospitalService.getHospitalsCount();
            response.status(200).json(result);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
    }
    
    /**
   * @swagger
   * /hostpitals:
   *    get:
   *      description:  Gets list for all hospitals
   */



    getAllHospitals = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.hospitalService.getHospitals(request.query);
            response.status(200).json(result)
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
    }

    /**
* @swagger
* /hostpitals/covid:
*    get:
*      description:  Gets list for hospitals with covid test sorted by priority
*/



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
        }
    }

    getHospitalBySlug = async (request: CRequest, response: CResponse) => {
        try {
            const nameSlug = request.params.nameSlug;
            const hospitals = await this.hospitalService.getHospitalBySlug(nameSlug);
            response.status(200).json(hospitals[0]);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            })
            const parsedError = error.parse()
            response.status(parsedError.statusCode).json(parsedError)
        }
    }
    
    getTags = async (request: CRequest, response: CResponse) => {
        try {
            const docs = await this.hospitalService.getHospitalTags();
            response.status(200).json({ docs });
        } catch (error) {
            this.handleError(500, error.message, response);
        }
    }

    createHospitalTag = async (request: CRequest, response: CResponse) => {
        try {
            const result = await this.hospitalService.createHospitalTag(request.body);
            response.status(201).json(result);
        } catch (error) {
            this.handleError(500, error.message, response);
        }
    }

    removeHospitalTag = async (request: CRequest, response: CResponse) => {
        try {
            const { name } = request.params;
            const result = await this.hospitalService.removeHospitalTag(name);
            if (!result) {
                this.handleError(404, `Tag does not exist`, response);
                return
            }
            response.status(200).json({
                message: `Tag: '${result.get("name")}' has been removed successfully`
            });
        } catch (error) {
            this.handleError(500, error.message, response);
        }
    }

    handleError(code: number, message: string, response: CResponse) {
        let error = new HttpException({
            statusCode: code,
            description: message,
        })
        const parsedError = error.parse()
        response.status(parsedError.statusCode).json(parsedError)
    }
}