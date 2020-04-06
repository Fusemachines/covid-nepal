import Joi from "joi";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import { NextFunction } from "express";

const validateNotice = (req: CRequest, res: CResponse, next: NextFunction) => {
    const { body } = req;

    const noticeSchema = Joi.object().keys({
        title: Joi.string().required(),
        url: Joi.string().required(),
        tag: Joi.string(),
        addedAt: Joi.date(),
        type: Joi.string(),
        imageUrl: Joi.string()
    })

    const result = Joi.validate(body, noticeSchema);
    const { error } = result;

    if (error && error.details) {
        res.status(422).json({
            message: 'Invalid request',
            errors: error.details
        })
    } else {
        next()
    }
}


export const validateNoticeUpdate = (req: CRequest, res: CResponse, next: NextFunction) => {
    const { body } = req;

    const noticeSchema = Joi.object().keys({
        title: Joi.string(),
        url: Joi.string(),
        tag: Joi.string(),
        addedAt: Joi.date(),
        type: Joi.string(),
        imageUrl: Joi.string()
    })

    const result = Joi.validate(body, noticeSchema);
    const { error } = result;

    if (error && error.details) {
        res.status(422).json({
            message: 'Invalid request',
            errors: error.details
        })
    } else {
        next()
    }
}

export default validateNotice