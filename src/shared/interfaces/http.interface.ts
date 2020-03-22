import { Request, Response } from "express"

export interface CRequest extends Request {
    lang: string
}

export interface CResponse extends Response { }

export enum ESortOrder {
    ASC = "asc",
    DESC = "desc",
    EMPTY = ""
}