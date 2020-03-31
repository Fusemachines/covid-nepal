import { IController } from "../shared/interfaces";
import { Router, Request, Response } from "express";
import { GlobalCountService } from "../services/global-count.service";
import HttpException from "../shared/exceptions/httpException";

export class GlobalCountController implements IController {
  public router: Router;
  public route: string = "counts/global";

  constructor(private globalCountService: GlobalCountService) {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/latest", this.getLatestCounts);
    this.router.put("/:id", this.update);
  }

  getLatestCounts = async (request: Request, response: Response) => {
    try {
      const counts = await this.globalCountService.getLatestCount();
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

  update = async (request: Request, response: Response) => {
    try {
      const count = await this.globalCountService.update(request.params.id, request.body);
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