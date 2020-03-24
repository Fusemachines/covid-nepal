import Joi from "joi";
import commonLangValidation from "./commonLang.validation";

export default function(req:any, res: any, next:any) {
    const { body } = req;

    const blogSchema = Joi.object().keys({
        name: commonLangValidation,
        hospitalType: commonLangValidation,
        availableTime: Joi.array().items(Joi.object().keys(commonLangValidation)),
        openDays: commonLangValidation,
        location: commonLangValidation,
        mapLink: commonLangValidation,
        totalBeds: Joi.number(),
        availableBeds: Joi.number(),
        covidTest: Joi.bool(),
        testingProcess: commonLangValidation,
        govtDesignated: Joi.bool(),
        numIsolationBeds: Joi.number(),
        icu: Joi.number(),
        focalPoint: commonLangValidation,
        contact: commonLangValidation,
        province: Joi.object().keys({
            code: Joi.number,
            name: commonLangValidation
        }),
        district: commonLangValidation
    })

    const result = Joi.validate(body, blogSchema);
    const { error } = result;
    
    if (error && error.details) {
        res.status(422).json({
            message: 'Invalid request',
            error
        })
    } else {
        next()
    }

}