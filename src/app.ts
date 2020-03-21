import Express, { Application } from "express";
import { IApplicationOptions, IDatabaseConnectionOptions } from "./shared/interfaces";
import { connect } from "mongoose";
import cors from "cors"
import { readFileSync } from "fs"
import https from "https"
import { CRequest, CResponse } from "./shared/interfaces/http.interface";
import swaggerUI from "swagger-ui-express"
// @ts-ignore: Resolve json module
import swaggerJSON from "../api_docs/swagger.json"

export default class App {
    private app: Application;
    port: number;

    constructor({ controllers, middlewares, port }: IApplicationOptions) {
        this.app = Express();
        this.port = port;

        this.middlewares(middlewares);
        this.createDatabaseConnection({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10)
        });
        this.initRoutes(controllers);
    }

    async createDatabaseConnection(connOptions: IDatabaseConnectionOptions) {
        try {
            let connectionUri = `mongodb://${connOptions.host}:${connOptions.port}/${connOptions.database}`;
            if (connOptions.username || connOptions.password) {
                connectionUri = `mongodb://${connOptions.username || ''}:${connOptions.password || ''}@${connOptions.host}:${connOptions.port}/${connOptions.database}`;
            }

            await connect(connectionUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });

        } catch (error) {
            global.logger.log({
                level: "Error",
                message: "Error connecting to database"
            })
            // console.warn(error);
        }
    }

    initRoutes(controllers: any[]) {

        this.app.get('/', function (request: CRequest, response: CResponse) {
            response.json({
                status: "UP"
            });
        })

        // Swagger docs
        this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON))


        controllers.forEach(controller => {
            this.app.use(`/:lang(en|np)/${controller.route}`,function(req:any, res, next) {
                req.lang = req.params.lang
                next()
            }, controller.router);
        })

    }

    middlewares(middlewares: any[]) {
        this.app.use(cors())
        this.app.disable('x-powered-by')
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        })
    }

    run(cb: () => void) {

        if (process.env.NODE_ENV === "production") {

            https.createServer({
                key: readFileSync("/etc/letsencrypt/live/api-prod.covidnepal.org/privkey.pem"),
                cert: readFileSync("/etc/letsencrypt/live/api-prod.covidnepal.org/cert.pem"),
                ca: readFileSync("/etc/letsencrypt/live/api-prod.covidnepal.org/chain.pem")
            }, this.app).listen(443, () => {
                console.log(`App is running under 443 port`)
            })

        } else {
            this.app.listen(this.port, cb);
        }
    }
}