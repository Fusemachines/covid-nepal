import { IController } from "../shared/interfaces";
import { Router, Request, Response, request } from "express";
import HttpException from "../shared/exceptions/httpException";
import { NewsService } from "../services/news.service";

export class NewsController implements IController {
  public router: Router;
  public route: string = "news";

  constructor(private newsService: NewsService) {
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/", this.add);
    this.router.put("/:id", this.update);
    this.router.get("/", this.getWithPagination);
    this.router.get("/tips", this.getTips);
    this.router.get("/top", this.getTop);
    this.router.get("/:id", this.getById);
    this.router.delete("/:id", this.delete);
  }

  add = async (request: Request, response: Response) => {
    try {
      const news = await this.newsService.add(request.body);
      response.json(news);
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
      const news = await this.newsService.update(request.params.id, request.body);
      response.json(news);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  getWithPagination = async (request: Request, response: Response) => {
    try {
      const news = await this.newsService.getWithPagination(request.query.type, request.query.page, request.query.size);
      response.json(news);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  getTips = async (request: Request, response: Response) => {
    try {
      const tips = await this.newsService.getTips();
      response.json({ docs: tips });
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  getTop = async (request: Request, response: Response) => {
    try {
      const top = await this.newsService.getTop();
      response.json(top);
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
      const news = await this.newsService.getById(request.params.id);
      response.json(news);
    } catch (error) {
      error = new HttpException({
        statusCode: 500,
        description: error.message,
      });
      const parsedError = error.parse();
      response.status(parsedError.statusCode).json(parsedError);
    }
  }

  delete = async (request: Request, response: Response) => {
    try {
      await this.newsService.deleteById(request.params.id);
      response.json({ "message": `News with id '${request.params.id}' deleted.` });
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

