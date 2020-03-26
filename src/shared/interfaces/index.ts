import { Router } from "express";

export interface IApplicationOptions {
    controllers: any[];
    middlewares: any[];
    port: number;
}

export interface IDatabaseConnectionOptions {
    host: string;
    username: string;
    password: string;
    database: string;
    port: number;
}

export interface IController {
    router: Router;
    initRoutes: () => void;
}

export * from "./district.interface";
export * from "./livedata.interface";
export * from "./nepal-count.interface";