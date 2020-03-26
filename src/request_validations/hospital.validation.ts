import Joi from "joi";
import commonLangValidation from "./commonLang.validation";
import { CRequest, CResponse } from "shared/interfaces/http.interface";
import { NextFunction } from "express";

const validateHospital = (req: CRequest, res: CResponse, next: NextFunction) => {
    const { body } = req;

    const blogSchema = Joi.object().keys({
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
        testingProcess: commonLangValidation,
        govtDesignated: Joi.bool(),
        numIsolationBeds: Joi.number(),
        icu: Joi.number(),
        focalPoint: commonLangValidation,
        contact: Joi.array().items(Joi.object().keys(commonLangValidation)),
        province: Joi.object().keys({
            code: Joi.number(),
            name: commonLangValidation
        }),
        district: commonLangValidation,
        isVerified: Joi.bool()
    })

    const result = Joi.validate(body, blogSchema);
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