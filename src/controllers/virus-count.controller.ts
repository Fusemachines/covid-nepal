import { Router, Request, Response, response } from "express";
import { IController } from "../shared/interfaces";
import { VirusCountService } from "../services"
import HttpException from "../shared/exceptions/httpException";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";

export class VirusCountController implements IController {

  public router: Router;
  public route: string = "virus-counts";

  constructor(private virusCountsService: VirusCountService) {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/today", this.getVirusCountsToday);
    this.router.get("/latest", this.getLatestVirusCounts);
    this.router.post("/", this.addVirusCount);
    this.router.put("/:id", this.updateVirusCount);
    this.router.delete("/:id", this.deleteVirusCount);
    this.router.get("/", this.getVirusCountsWithPagination);
  }

  getVirusCountsToday = async (request: CRequest, response: CResponse) => {
    try {
      const counts = await this.virusCountsService.getVirusCountsToday();
      response.json(counts);
    } 
    catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      })
      const parsedError = error.parse()
      response.status(parsedError.statusCode).json(parsedError)
    }
  }

  getLatestVirusCounts = async (request: CRequest, response: CResponse) => {
    try {
      const counts = await this.virusCountsService.getLatestVirusCounts();
      response.json({ "data": counts });

    } 
    catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      })
      const parsedError = error.parse()
      response.status(parsedError.statusCode).json(parsedError)
    }
  }

  addVirusCount = async (request: CRequest, response: CResponse) => {
    try {
      const virusCount = await this.virusCountsService.addVirusCount(request.body);
      response.json(virusCount);
    } 
    catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      })
      const parsedError = error.parse()
      response.status(parsedError.statusCode).json(parsedError)
    }
  }

  updateVirusCount = async (request: CRequest, response: CResponse) => {
    try {
      const result = await this.virusCountsService.update(request.params.id, request.body);
      response.json(result);
    } 
    catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      })
      const parsedError = error.parse()
      response.status(parsedError.statusCode).json(parsedError)
    }
  }

  deleteVirusCount = async (request: CRequest, response: CResponse) => {
    try {

      const result: any = await this.virusCountsService.delete(request.params.id);
      if (result === null) {
        throw new HttpException({
          statusCode: 500,
          description: "Unable to delete virus count record",
        })
      }

      response.json({
        message: `Virus count data removed successfully.`
      });
    } 
    catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      })
      const parsedError = error.parse()
      response.status(parsedError.statusCode).json(parsedError)
    }
  }

  getVirusCountsWithPagination =  async (request: CRequest, response: CResponse) => {
    try {
      const data = await this.virusCountsService.getVirusCountsWithPagination(request.query.page, request.query.size);
      response.json(data);
    } 
    catch (error) {
      return response.status(500).json({ error })
    }
  }

}
