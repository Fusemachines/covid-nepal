import { IController } from "../shared/interfaces";
import { Router } from "express";
import HttpException from "../shared/exceptions/httpException";
import { NoticeService } from "../services/notice.service";
import ValidateNotice, { validateNoticeUpdate } from "../request_validations/notice.validation"
import { CRequest, CResponse } from "src/shared/interfaces/http.interface";

export class NoticeController implements IController {
    public router: Router;
    public route: string = "notices";

    constructor(private noticeService: NoticeService) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.post("/", ValidateNotice, this.create);
        this.router.get("/", this.getWithPagination);
        this.router.get("/:type", this.getByType);
        this.router.put("/:id", validateNoticeUpdate, this.update);
        this.router.delete("/:id", this.delete);
    }

    create = async (request: CRequest, response: CResponse) => {
        try {
            const notices = await this.noticeService.add(request.body);
            response.json(notices);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }

    update = async (request: CRequest, response: CResponse) => {
        try {
            const notice = await this.noticeService.update(request.params.id, request.body);
            response.json(notice);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }

    getWithPagination = async (request: CRequest, response: CResponse) => {
        try {
            const notices = await this.noticeService.getWithPagination(request.query.type, request.query.page, request.query.size);
            response.json(notices);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }

    getByType = async (request: CRequest, response: CResponse) => {
        try {
            const notices = await this.noticeService.getByType(request.params.type);
            response.json(notices);
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }

    delete = async (request: CRequest, response: CResponse) => {
        try {
            await this.noticeService.deleteById(request.params.id);
            response.json({ "message": `Notice with id '${request.params.id}' deleted.` });
        } catch (error) {
            error = new HttpException({
                statusCode: 500,
                description: error.message,
            });
            const parsedError = error.parse();
            response.status(parsedError.statusCode).json(parsedError);
        }
    }

}

