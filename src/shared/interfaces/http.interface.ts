import { Request, Response } from "express"

export interface CRequest extends Request {
    lang: string
}

export interface CResponse extends Response { }

export interface IQuery {
    order: ESortOrder;
    orderBy: string;
    page: number | string;
    size: number | string;
}


export interface IPagination {
    size: number | string;
    page: number | string;
}

export interface ISort {
    order: ESortOrder;
    orderBy: string;
}


export enum ESortOrder {
    ASC = "asc",
    DESC = "desc",
    EMPTY = ""
}