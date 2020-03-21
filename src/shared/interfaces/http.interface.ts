import { Request, Response } from "express"

export interface CRequest extends Request {
    lang: string
}

export interface CResponse extends Response {}