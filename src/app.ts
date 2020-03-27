import Express, { Application, NextFunction } from "express";
import { IApplicationOptions, IDatabaseConnectionOptions } from "./shared/interfaces";
import { connect } from "mongoose";
import cors from "cors"
import { readFileSync } from "fs"
import https from "https"
import { CRequest, CResponse } from "./shared/interfaces/http.interface";
import swaggerUI from "swagger-ui-express"
// @ts-ignore: Resolve json module
import compression from "compression";
const basicAuth = require('express-basic-auth');
import lusca from "lusca"
const YAML = require("yamljs");
const swaggerYAML = YAML.load("api_docs/swagger.yaml")

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
                level: "error",
                message: "Error connecting to database"
            })
        }
    }

    getUnauthorizedResponse(request: any) {
        return request.auth
            ? ('Unable to access')
            : 'No credentials provided'
    }

    initRoutes(controllers: any[]) {
        this.app.get('/', function (request: CRequest, response: CResponse) {
            response.json({
                status: "UP"
            });
        })

        this.app.post("*", basicAuth({
            users: { 'apiadmin': '37d224b2-a0d0-4786-a331-708ceea4ae93' },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        this.app.put("*", basicAuth({
            users: { 'apiadmin': '37d224b2-a0d0-4786-a331-708ceea4ae93' },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        this.app.patch("*", basicAuth({
            users: { 'apiadmin': '37d224b2-a0d0-4786-a331-708ceea4ae93' },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        this.app.delete("*", basicAuth({
            users: { 'apiadmin': '37d224b2-a0d0-4786-a331-708ceea4ae93' },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        // Swagger docs
        this.app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerYAML))

        controllers.forEach(controller => {
            this.app.use(`/${controller.route}`, controller.router);
        })

    }

    middlewares(middlewares: any[]) {
        /**
         * Security headers
         * 
         */
        this.app.use(lusca.xframe("SAMEORIGIN"))
        this.app.use(lusca.xssProtection(true))
        this.app.use(lusca.nosniff())
        this.app.use(lusca.csp({
            policy: {
                'default-src': process.env.APP_CSP_SRC ? `'self' ${process.env.APP_CSP_SRC}` : '*',
                'img-src': "* data:",
                'style-src': "* 'unsafe-inline'",
                'font-src': "'self' data:",
            }
        }))
        this.app.use(lusca.referrerPolicy('same-origin'))
        this.app.use(lusca.hsts({
            maxAge: 31536000,
            includeSubDomains: true
        }))
        this.app.use(compression());
        this.app.disable('x-powered-by')
        
        // Cross origin request
        if (["production"].indexOf(process.env.NODE_ENV) !== -1) {
            const whitelist = ['https://covidnepal.org', 'https://www.covidnepal.org', 'http://www.covidnepal.org', 
                                'https://dev.covidnepal.org', 'http://dev.covidnepal.org', 'http://localhost:3000', 'https://admin.covidnepal.org'];

            const corsOptions = {
                origin: function (origin:string, callback:any) {
                    console.log(`CORS request origin -> ${origin}`);

                    if (whitelist.indexOf(origin) !== -1) {
                        callback(null, true)
                    } else {
                        callback('Domain is not valid.')
                    }
                }
            }

            this.app.use(cors(corsOptions))
        } else {
            this.app.use(cors())
        }

        middlewares.forEach(middleware => {
            this.app.use(middleware);
        })
    }

    run(cb: () => void) {

        if (process.env.NODE_ENV !== "local") {
            https.createServer({
                key: readFileSync(process.env.SSL_KEY),
                cert: readFileSync(process.env.SSL_CERT),
                ca: readFileSync(process.env.SSL_CA)
            }, this.app).listen(5000, () => {
                console.log(`App is running under 5000 port`)
            })

        } else {
            this.app.listen(this.port, cb);
        }
    }
}
