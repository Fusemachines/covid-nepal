import { IController } from "../shared/interfaces";
import { Router, Request, Response } from "express";
import { DistrictService } from "../services/district.service";


export class DistrictController implements IController {
    route: string = "districts"
    router: Router;

    constructor(private districtService: DistrictService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/", this.getDistricts);
    }

    getDistricts = async (request: Request, response: Response) => {
        const { province } = request.query;
        try {
            const docs = await this.districtService.getDistricts({ province });
            response.status(200).json({ docs });
        } catch (error) {
            response.status(500).json({ error });
        }
    }


}