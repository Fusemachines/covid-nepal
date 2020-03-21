import { IController } from "../shared/interfaces";
import { Router, Request, Response } from "express";
import { DistrictService } from "../services/district.service";


export class HospitalController implements IController {
    route: string = "hospitals"
    router: Router;

    constructor(private districtService: DistrictService) {
        this.router = Router();
        this.initRoutes();
    }


    initRoutes() {

    }

}