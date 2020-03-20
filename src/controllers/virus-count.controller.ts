import { Router, Request, Response, response } from "express";
import { IController } from "shared/interfaces";
import { VirusCountService } from "../services"

export class VirusCountController implements IController {

  public router: Router;
  public route: string = "virus-counts"

  constructor(private virusCountsService: VirusCountService) {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.get("/today", this.getVirusCountsToday);
  }

  getVirusCountsToday = (req: Request, res: Response) => {
    try {
      const counts = this.virusCountsService.getVirusCountsToday();
      return res.json(counts);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ error })
    }
  }
}
