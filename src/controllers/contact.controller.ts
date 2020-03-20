import { Router, Request, Response, response } from "express";
import { ContactService } from "../services/contact.service";
import { IController } from "../shared/interfaces";

export class ContactController implements IController {
    public route: string = "contacts";
    public router: Router;

    constructor(
        private contactService: ContactService
    ) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get("/emergency", this.getEmergencyContacts);
        this.router.get("/hospitals", this.getHospitalContacts)
    }

    getEmergencyContacts = async (request: Request, response: Response) => {
        try {
            const docs = await this.contactService.getEmergencyContacts();
            response.status(200).json({ docs });
        } catch (error) {
            response.status(500).json(error);
        }
    }

    getHospitalContacts = async (request: Request, response: Response) => {
        const { district } = request.query;
        try {
            const docs = await this.contactService.getHospitals({ district });
            response.status(200).json({ docs });
        } catch (error) {
            response.status(500).json({
                error
            })
        }
    }

}