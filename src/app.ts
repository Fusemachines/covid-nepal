import Express, { Application, Response, Request } from "express";
import { IApplicationOptions, IDatabaseConnectionOptions } from "./shared/interfaces";
import { connect } from "mongoose";

export default class App {
    private app: Application;
    port: number;

    constructor(
        {
            controllers, middlewares, port
        }: IApplicationOptions
    ) {
        this.app = Express();
        this.port = port;
        this.createDatabaseConnection({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10)
        });
        this.middlewares(middlewares);
        this.initRoutes(controllers);
    }

    async createDatabaseConnection(connOptions: IDatabaseConnectionOptions) {
        try {
            let connectionUri = `mongodb://${connOptions.username || ''}:${connOptions.password || ''}@${connOptions.host}:${connOptions.port}/${connOptions.database}`;
            await connect(connectionUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (error) {
            console.log("Error connecting to database");
            console.log(error);
        }
    }

    initRoutes(controllers: any[]) {
        this.app.get('/', function (req: Request, res: Response) {
            res.send("Server running");
        })
        controllers.forEach(controller => {
            this.app.use(`/${controller.route}`, controller.router);
        })

    }

    middlewares(middlewares: any[]) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        })
    }

    run(cb: () => void) {
        this.app.listen(this.port, cb);
    }




}