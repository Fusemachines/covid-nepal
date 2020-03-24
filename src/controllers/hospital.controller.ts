import { IController } from "../shared/interfaces";
import { Router, Request, Response, NextFunction, response } from "express";
import { HospitalService } from "../services/hospital.service";
import HttpException from "../shared/exceptions/httpException";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import validateHospital from "request_validations/hospital.validation";
// @ts-ignore: Resolve json module
import hospitalJson from "../../hospitaldata.json"
import fs from "fs"
import path from "path"

export class HospitalController implements IController {
    route: string = "hospitals"
    router: Router;

    constructor(private hospitalService: HospitalService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/", this.createHospital);
        this.router.get("/import/:from/:to", this.importFromJsonFile);
        this.router.get("/", this.getAllHospitals);
        this.router.get("/covid", this.getHospitalsForCovid);
        this.router.get("/:nameSlug", this.getHospitalBySlug);
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

    importFromJsonFile = async (request: CRequest, response: CResponse) => {
        const { from, to } = request.params

        let newRecords:any = []
        for(let record of hospitalJson) {
            let key = record["S/No"][''];
            if (key >= from && key <= to && record["In Database"] == "0") {
                let contacts = []
                if (record["contact1"]) {
                    contacts.push(record["contact1"])
                }

                if (record["contact2"]) {
                    contacts.push(record["contact2"])
                }

                if (record["contact3"]) {
                    contacts.push(record["contact3"])
                }

                let totalNumberOfBed = record["totalBeds"] ? record["totalBeds"].match(/\d+/)[0] : null
                
                newRecords.push({
                    name: record["Hospital Name"],
                    hospitalType: record["hospitalType"],
                    availableTime: ["open:time", "close:time"],
                    openDays: record["openDays"],
                    location: record["location"],
                    mapLink: record["mapLink"],
                    totalBeds: totalNumberOfBed,
                    availableBeds: record["availableBeds"],
                    covidTest: record["covidTest"] ? !!record["covidTest"] : null,
                    testingProcess: record["testingProcess"],
                    govtDesignated: record["govtDesignated"] ? !!record["govtDesignated"] : null,
                    numIsolationBeds: Number(record["numIsolationBeds"]),
                    ventilators: record["Ventilators"],
                    nameSlug: record["nameSlug"],
                    icu: record["icu"],
                    contact: contacts,
                    focalPoint: record["focalPoint"],
                    province: {
                        code: Number(record["province code"]),
                        name: record["province name"]
                    },
                    district: record["district"]
                })
            }
        }

        // for (let insertData of newRecords) {
        //     await this.hospitalService.createHospital(insertData);
        // }

        response.send(hospitalJson);
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
            response.status(500).json({ error })
        }
    }
}
