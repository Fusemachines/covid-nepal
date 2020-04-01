import { IController } from "../shared/interfaces";
import { Router, request, Request, Response } from "express";
import { NepalCountService } from "../services/nepal-count.service";
import HttpException from "../shared/exceptions/httpException";

export class NepalCountController implements IController {
  public router: Router;
  public route: string = "counts/nepal";

  constructor(private nepalCountService: NepalCountService) {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/latest", this.getLatestCounts);
    this.router.post("/", this.addNepalCount);
    this.router.put("/:id", this.updateNepalCount);
    this.router.get("/", this.getCountsWithPagination);
    this.router.get("/:id", this.getById);
  }

  getLatestCounts = async (request: Request, response: Response) => {
    try {
      const counts = await this.nepalCountService.getLatestCount();
      response.json(counts);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  addNepalCount = async (request: Request, response: Response) => {
    try {
      const count = await this.nepalCountService.add(request.body);
      response.json(count);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  updateNepalCount = async (request: Request, response: Response) => {
    try {
      const count = await this.nepalCountService.update(request.params.id, request.body);
      response.json(count);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  getCountsWithPagination = async (request: Request, response: Response) => {
    try {
      const counts = await this.nepalCountService.getCountsWithPagination(request.query.page, request.query.size);
      response.json(counts);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  getById = async (request: Request, response: Response) => {
    try {
      const count = await this.nepalCountService.getById(request.params.id);
      response.json(count);
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