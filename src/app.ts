import Express, { Application, NextFunction } from "express";
import { IApplicationOptions, IDatabaseConnectionOptions, INepalCount } from "./shared/interfaces";
import { connect } from "mongoose";
import cors from "cors"
import { readFileSync } from "fs"
import https from "https"
import { CRequest, CResponse } from "./shared/interfaces/http.interface";
import {serve, setup} from "swagger-ui-express"
// @ts-ignore: Resolve json module
import compression from "compression";
import lusca from "lusca"
import cron from "node-cron"
import { NepalCountModel } from "./models/nepal-count.model";
import axios from "axios";
import { NepalCountService, GlobalCountService } from "./services";
import { GlobalCountModel } from "./models/global-count.model";
import { IGlobalCount } from "./shared/interfaces/global-count.interface";
import { specs } from "./shared/utils";

const YAML = require("yamljs");
const swaggerYAML = YAML.load("api_docs/swagger.yaml")
const basicAuth = require('express-basic-auth');

export default class App {
    private app: Application;
    port: number;
    nepalCountService: NepalCountService;
    globalCountService: GlobalCountService;

    constructor({ controllers, middlewares, port }: IApplicationOptions) {
        this.app = Express();
        this.port = port;
        this.nepalCountService = new NepalCountService();
        this.globalCountService = new GlobalCountService();

        this.middlewares(middlewares);
        this.createDatabaseConnection({
            database: process.env.DB_DATABASE,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10)
        });
        this.initRoutes(controllers);
        this.loadNepalCount();
        this.loadGlobalCount();
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

    async loadNepalCount() {
        let that = this;
        try {
            cron.schedule('0 0 */1 * * *', async () => {
                let date = new Date();
                date.setUTCHours(0, 0, 0, 0);
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const count = await NepalCountModel.findOne({ createdAt: { $gte: date, $lte: nextDate } }).lean().exec();

                const { data } = await axios.get('https://covidapi.naxa.com.np/api/v1/stats/');
                const nepalCount: INepalCount = {
                    testedTotal: data.tested,
                    confirmedTotal: data.confirmed,
                    deathTotal: data.death,
                    recoveredTotal: Number(data.confirmed) - Number(data.isolation)
                };
                if (count != undefined) {
                    // update
                    await that.nepalCountService.updateNepalCount(count._id, nepalCount);
                } else {
                    // create
                    await that.nepalCountService.addNepalCount(nepalCount);
                }
            })
        } catch (error) {
            global.logger.log({
                label: "error",
                message: error.message
            });
        }
    }

    async loadGlobalCount() {
        let that = this;
        try {
            cron.schedule('0 0 */1 * * *', async () => {
                let date = new Date();
                date.setUTCHours(0, 0, 0, 0);
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const count = await GlobalCountModel.findOne({ createdAt: { $gte: date, $lte: nextDate } }).lean().exec();

                const { data } = await axios.get('https://api.coronatracker.com/v3/stats/worldometer/global');
                const globalCount: IGlobalCount = {
                    confirmedTotal: data.totalConfirmed,
                    deathTotal: data.totalDeaths,
                    recoveredTotal: data.totalRecovered
                };
                if (count != undefined) {
                    // update
                    await that.globalCountService.updateGlobalCount(count._id, globalCount);
                } else {
                    // create
                    await that.globalCountService.addGlobalCount(globalCount);
                }
            })
        } catch (error) {
            global.logger.log({
                label: "error",
                message: error.message
            });
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
        this.app.use('/api-docs', serve, setup(swaggerYAML))

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
                'https://dev.covidnepal.org', 'http://dev.covidnepal.org', 'http://localhost:3000', 'https://admin.covidnepal.org' ,'https://admin-dev.covidnepal.org'];

            const corsOptions = {
                origin: function (origin: string, callback: any) {
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
