import { Router, Request, Response, response } from "express";
import { IController } from "shared/interfaces";
import { VirusCountService } from "../services"
import HttpException from "../shared/exceptions/httpException";

export class VirusCountController implements IController {

  public router: Router;
  public route: string = "virus-counts"

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

  getVirusCountsToday = async (req: Request, res: Response) => {
    try {
      const counts = await this.virusCountsService.getVirusCountsToday();
      return res.json(counts);
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

  getLatestVirusCounts = async (req: Request, res: Response) => {
    try {
      const counts = await this.virusCountsService.getLatestVirusCounts();
      return res.json({ "data": counts });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error })
    }
  }

  addVirusCount = async (req: Request, res: Response) => {
    try {
      const virusCount = await this.virusCountsService.addVirusCount(req.body);
      console.log(virusCount);
      return res.json(virusCount);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      })
      const parsedError = error.parse()
      response.status(parsedError.statusCode).json(parsedError)
    }
  }

  updateVirusCount = async (request: Request, response: Response) => {
    try {
      const result = await this.virusCountsService.update(request.params.id, request.body);
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

  deleteVirusCount = async (request: Request, response: Response) => {
    try {

      const result: any = await this.virusCountsService.delete(request.params.id);
      if (result === null) {
        return response.status(500).json({
          error: "Unable to delete virus count record"
        })
      }

      return response.json({
        message: `Virus count data removed successfully.`
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

  getVirusCountsWithPagination =  async (req: Request, res: Response) => {
    try {
      const data = await this.virusCountsService.getVirusCountsWithPagination(req.query.page, req.query.size);
      return res.json(data);
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

}
