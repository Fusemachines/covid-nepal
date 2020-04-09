import Joi from "joi";
import commonLangValidation, { nullableLanguageSchema } from "./commonLang.validation";
import { CRequest, CResponse } from "../shared/interfaces/http.interface";
import { NextFunction } from "express";

export const validateHospitalTag = (req: CRequest, res: CResponse, next: NextFunction) => {
    const { body } = req;
    const hospitalTagSchema = Joi.object().keys({
        name: Joi.string().required(),
    })
    const result = Joi.validate(body, hospitalTagSchema);
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

const validateHospital = (req: CRequest, res: CResponse, next: NextFunction) => {
    const { body } = req;

    const hospitalSchema = Joi.object().keys({
        coordinates: Joi.array().items(Joi.number()),
        name: commonLangValidation,
        nameSlug: Joi.string(),
        hospitalType: commonLangValidation,
        availableTime: Joi.array().items(Joi.object().keys(commonLangValidation)),
        openDays: commonLangValidation,
        location: commonLangValidation,
        mapLink: Joi.string(),
        totalBeds: Joi.number(),
        availableBeds: Joi.number(),
        covidTest: Joi.bool(),
        testingProcess: nullableLanguageSchema,
        govtDesignated: Joi.bool(),
        numIsolationBeds: Joi.number(),
        icu: Joi.number(),
        focalPoint: nullableLanguageSchema,
        ventilators: Joi.number(),
        contact: Joi.array().items(Joi.object().keys(commonLangValidation)),
        authorizedCovidTest: Joi.bool().required(),
        priority: Joi.optional(),
        province: Joi.object().keys({
            code: Joi.number(),
            name: commonLangValidation
        }),
        district: commonLangValidation,
        isVerified: Joi.bool()
    })

    const result = Joi.validate(body, hospitalSchema);
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

export default validateHospital