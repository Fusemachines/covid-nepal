import { Router, Request, Response, response } from "express";
import { ContactService } from "../services/contact.service";
import { IController } from "../shared/interfaces";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import HttpException from "../shared/exceptions/httpException";

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
        this.router.post("/", this.createContact);
        this.router.get("/emergency", this.getEmergencyContacts);
        this.router.get("/hospitals", this.getHospitalContacts);
        this.router.delete('/:id', this.removeContact);
        this.router.patch("/:id", this.updateContact);
    }


    updateContact = async (request: CRequest, response: CResponse) => {

        const contactId = request.params.id;
        try {
            global.logger.log({
                level: 'info',
                message: `Updaing hospital->id:${request.params.id}, body: ${JSON.stringify(request.body)}`
            });
            const result = await this.contactService.updateContactById(contactId, request.body);
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
    createContact = async (request: Request, response: Response) => {
        try {
            const contact = await this.contactService.createContact(request.body);
            response.status(201).json({
                contact
            })
        } catch (error) {
            response.status(500).json({ error });
        }
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
        const province = request.query.province;

        try {
            const docs = await this.contactService.getHospitals(province, { district });
            response.status(200).json({ docs });
        } catch (error) {
            response.status(500).json({
                error
            })
        }
    }

    removeContact = async (request: CRequest, response: CResponse) => {

        const contactId = request.params.id;
        try {
            const result: any = await this.contactService.removeContactById(contactId);
            if (result === null) {
                const error: any = new HttpException({
                    statusCode: 500,
                    description: "Unable to delete contact record",
                })
                const parsedError = error.parse()
                return response.status(parsedError.statusCode).json(parsedError)
            }

            return response.json({
                message: `'${result.name || ""}' contact removed successfully.`
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

}