import Express, { Application } from "express";
import { IApplicationOptions, IDatabaseConnectionOptions, INepalCount } from "./shared/interfaces";
import { connect } from "mongoose";
import cors from "cors"
import { readFileSync } from "fs"
import https from "https"
import { CRequest, CResponse } from "./shared/interfaces/http.interface";
import { serve, setup } from "swagger-ui-express"
// @ts-ignore: Resolve json module
import compression from "compression";
import lusca from "lusca";
import cron from "node-cron";
import { NepalCountModel } from "./models/nepal-count.model";
import axios from "axios";
import { NepalCountService, GlobalCountService } from "./services";
import { GlobalCountModel } from "./models/global-count.model";
import { IGlobalCount } from "./shared/interfaces/global-count.interface";
// import { specs } from "./shared/utils";
// import { any } from "joi";

const YAML = require("yamljs");
const swaggerYAML = YAML.load("api_docs/swagger.yaml")
const basicAuth = require('express-basic-auth');
const whitelist = ['https://covidnepal.org', 'https://www.covidnepal.org', 'http://www.covidnepal.org',
    'https://dev.covidnepal.org', 'http://dev.covidnepal.org', 'http://localhost:3000', 'https://admin.covidnepal.org', 'https://admin-dev.covidnepal.org'];

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
                useFindAndModify: false,
                useCreateIndex :true
            });

        } catch (error) {
            global.logger.log({
                level: "error",
                message: "Error connecting to database"
            })
        }
    }

    async loadNepalCount() {
        if (!((process.env.NODE_ENV === "production" && process.env.NODE_APP_INSTANCE === '0') || process.env.NODE_ENV === "development")) {
            return;
        }
        
        let that = this;
        try {
            cron.schedule('0 0 */1 * * *', async () => {
                let date = new Date();

                global.logger.log({ level: 'info', message: `Scheduler to update Nepal count triggered. Time: ${date}` });

                date.setUTCHours(0, 0, 0, 0);
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);

                const count = await NepalCountModel.findOne({ createdAt: { $gte: date, $lte: nextDate } }).lean().exec();

                const { data } = await axios.get('https://covid19.mohp.gov.np/covid/api/confirmedcases');
                const nepalCount: INepalCount = {
                    testedTotal: data.nepal.samples_tested,
                    confirmedTotal: data.nepal.positive,
                    deathTotal: data.nepal.deaths,
                    recoveredTotal: data.nepal.extra1
                };

                if (count != undefined) {
                    // update
                    if (this.isNepalCountLatest(count, nepalCount)) {
                        await that.nepalCountService.update(count._id, nepalCount);
                        global.logger.log({ level: 'info', message: `Scheduler successfully updated Nepal count. Time ${date}` });
                    } else {
                        global.logger.log({ level: 'info', message: `Scheduler aborted updating Nepal count due to manual override. Time ${date}` });
                    }
                } else {
                    // create
                    const previousData = await that.nepalCountService.getLatestCount();

                    if (previousData == undefined) {
                        await that.nepalCountService.add(nepalCount);
                        global.logger.log({ level: 'info', message: `Scheduler successfully created first Nepal count. Time ${date}` });
                    } else if (this.isNepalCountLatest(previousData, nepalCount)) {
                        await that.nepalCountService.add(nepalCount);
                        global.logger.log({ level: 'info', message: `Scheduler successfully created Nepal count. Time ${date}` });
                    } else {
                        global.logger.log({ level: 'info', message: `Scheduler aborted creating new Nepal count due to manual override. Time ${date}` })
                    }
                }
            })
        } catch (error) {
            global.logger.log({
                label: "error",
                message: error.message
            });
        }
    }

    private isNepalCountLatest(previousData: any, newData: INepalCount): boolean {
        if (newData.testedTotal < previousData.testedTotal ||
            newData.confirmedTotal < previousData.confirmedTotal ||
            newData.recoveredTotal < previousData.recoveredTotal ||
            newData.deathTotal < previousData.deathTotal) {
            return false;
        }

        return true;
    }

    async loadGlobalCount() {
        if (!((process.env.NODE_ENV === "production" && process.env.NODE_APP_INSTANCE === '0') || process.env.NODE_ENV === "development")) {
            return;
        }

        let that = this;
        try {
            cron.schedule('0 0 */1 * * *', async () => {
                let date = new Date();

                global.logger.log({ level: 'info', message: `Scheduler to update Global count triggered. Time: ${date}` });

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
                    if (this.isGlobalCountLatest(count, globalCount)) {
                        await that.globalCountService.update(count._id, globalCount);
                        global.logger.log({ level: 'info', message: `Scheduler successfully updated Global count. Time ${date}` });
                    } else {
                        global.logger.log({ level: 'info', message: `Scheduler aborted updating Global count due to manual override. Time ${date}` });
                    }
                } else {
                    // create
                    const previousData = await that.globalCountService.getLatestCount();

                    if (previousData == undefined) {
                        await that.globalCountService.add(globalCount);
                        global.logger.log({ level: 'info', message: `Scheduler successfully created first Global count. Time ${date}` });
                    } else if (this.isGlobalCountLatest(previousData, globalCount)) {
                        await that.globalCountService.add(globalCount);
                        global.logger.log({ level: 'info', message: `Scheduler successfully created Global count. Time ${date}` });
                    } else {
                        global.logger.log({ level: 'info', message: `Scheduler aborted creating new Global count due to manual override. Time ${date}` })
                    }
                }
            })
        } catch (error) {
            global.logger.log({
                label: "error",
                message: error.message
            });
        }
    }

    private isGlobalCountLatest(previousData: any, newData: IGlobalCount) {
        if (newData.confirmedTotal < previousData.confirmedTotal ||
            newData.recoveredTotal < previousData.recoveredTotal ||
            newData.deathTotal < previousData.deathTotal) {
            return false;
        }

        return true;
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
        });
        
        this.app.post("*", basicAuth({
            users: { [process.env.API_USERNAME]: process.env.API_PASSWORD },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        this.app.put("*", basicAuth({
            users: { [process.env.API_USERNAME]: process.env.API_PASSWORD },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        this.app.patch("*", basicAuth({
            users: { [process.env.API_USERNAME]: process.env.API_PASSWORD },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        this.app.delete("*", basicAuth({
            users: { [process.env.API_USERNAME]: process.env.API_PASSWORD },
            unauthorizedResponse: this.getUnauthorizedResponse
        }))

        this.app.use(cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                if (whitelist.indexOf(origin) === -1) {
                    return callback(new Error('The CORS policy for this site does not allow the specified Origin'), false);
                }
                return callback(null, true);
            },
            exposedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'api_key', 'x-api-key'],
            credentials: true
        }));

        // Swagger docs
        const host = process.env.APP_HOST;
        const port = process.env.APP_PORT;
        const baseUrl = `${host}:${port}`;
        this.app.use('/api-docs', function (req: any, res: any, next: any) {
            swaggerYAML.host = baseUrl;
            req.swaggerDoc = swaggerYAML;
            next();
        }, serve, setup());

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
                'https://dev.covidnepal.org', 'http://dev.covidnepal.org', 'http://localhost:3000', 'https://admin.covidnepal.org', 'https://admin-dev.covidnepal.org'];


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
