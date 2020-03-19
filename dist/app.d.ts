import { IApplicationOptions, IDatabaseConnectionOptions } from "./shared/interfaces";
export default class App {
    private app;
    port: number;
    constructor({ controllers, middlewares, port }: IApplicationOptions);
    createDatabaseConnection(connOptions: IDatabaseConnectionOptions): Promise<void>;
    initRoutes(controllers: any[]): void;
    middlewares(middlewares: any[]): void;
    run(cb: () => void): void;
}
