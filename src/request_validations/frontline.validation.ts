import Joi from "joi";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import { NextFunction } from "express";

export const validateCreateSupporter = (req: CRequest, res: CResponse, next: NextFunction) => {
    const { body } = req;

    const createSupporterSchema = {
        name: Joi.string().required(),
        contact: {
            email: Joi.string().email().required(),
            phone: Joi.string().required()
        },
        organization: Joi.string(),
        isVerified: Joi.boolean(),
        location: Joi.string(),
        providedItems: Joi.array().items(Joi.string()),
        others: Joi.string(),
        fulfillByDate: Joi.date()
    }

    const result = Joi.validate(body, createSupporterSchema);
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


export const validateCreateRequest = (req: CRequest, res: CResponse, next: NextFunction) => {
    const { body } = req;

    const createRequestSchema = {
        name: Joi.string().required(),
        contact: {
            email: Joi.string().email().required(),
            phone: Joi.string().required()
        },
        organization: Joi.string(),
        isVerified: Joi.boolean(),
        isFulfilled: Joi.boolean(),
        location: Joi.string(),
        requestedItems: Joi.array().items(Joi.string()),
        fulfilledBy: Joi.array().items(Joi.string()),
        others: Joi.string()
    }

    const result = Joi.validate(body, createRequestSchema);
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



export const validateUpdateSupporter = (request: CRequest, response: CResponse, next: NextFunction) => {
    const { body } = request;

    const updateSupporterSchema = {
        name: Joi.string(),
        contact: {
            email: Joi.string().email(),
            phone: Joi.string()
        },
        organization: Joi.string(),
        isVerified: Joi.boolean(),
        location: Joi.string(),
        providedItems: Joi.array().items(Joi.string()),
        others: Joi.string(),
        fulfillByDate: Joi.date()
    }

    const result = Joi.validate(body, updateSupporterSchema);
    const { error } = result;

    if (error && error.details) {
        response.status(422).json({
            message: 'Invalid request',
            errors: error.details
        })
    } else {
        next()
    }
}



export const validateUpdateRequest = (request: CRequest, response: CResponse, next: NextFunction) => {
    const { body } = request;

    const updateRequestSchema = {
        name: Joi.string(),
        contact: {
            email: Joi.string().email(),
            phone: Joi.string()
        },
        organization: Joi.string(),
        isVerified: Joi.boolean(),
        isFulfilled: Joi.boolean(),
        location: Joi.string(),
        requestedItems: Joi.array().items(Joi.string()),
        fulfilledBy: Joi.array().items(Joi.string()),
        others: Joi.string()
    }

    const result = Joi.validate(body, updateRequestSchema);
    const { error } = result;

    if (error && error.details) {
        response.status(422).json({
            message: 'Invalid request',
            errors: error.details
        })
    } else {
        next()
    }
}