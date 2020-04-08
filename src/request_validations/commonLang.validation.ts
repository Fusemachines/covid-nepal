import Joi from "joi";

export default {
    en: Joi.string().required(),
    np: Joi.optional()
}

export const nullableLanguageSchema = {
    en: Joi.optional(),
    np: Joi.optional()
}