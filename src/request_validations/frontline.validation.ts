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
        organization: Joi.string().allow(null, ''),
        isVerified: Joi.boolean().allow(null, ''),
        location: Joi.string().allow(null, ''),
        providedItems: Joi.array().items(Joi.string().allow(null, '')),
        others: Joi.string().allow(null, ''),
        fulfillByDate: Joi.date().allow(null, '')
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
        organization: Joi.string().allow(null, ''),
        isVerified: Joi.boolean().allow(null, ''),
        isFulfilled: Joi.boolean().allow(null, ''),
        location: Joi.string().allow(null, ''),
        requestedItems: Joi.array().items(Joi.string().allow(null, '')),
        fulfilledBy: Joi.array().items(Joi.string().allow(null, '')),
        others: Joi.string().allow(null, '')
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
            email: Joi.string().email().allow(null, ''),
            phone: Joi.string()
        },
        organization: Joi.string().allow(null, ''),
        isVerified: Joi.boolean().allow(null, ''),
        location: Joi.string().allow(null, ''),
        providedItems: Joi.array().items(Joi.string().allow(null, '')),
        others: Joi.string().allow(null, ''),
        fulfillByDate: Joi.date().allow(null, '')
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
            email: Joi.string().email().allow(null, ''),
            phone: Joi.string()
        },
        organization: Joi.string().allow(null, ''),
        isVerified: Joi.boolean().allow(null, ''),
        isFulfilled: Joi.boolean().allow(null, ''),
        location: Joi.string().allow(null, ''),
        requestedItems: Joi.array().items(Joi.string().allow(null, '')),
        fulfilledBy: Joi.array().items(Joi.string().allow(null, '')),
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