import { Schema, model } from "mongoose";
import { LangSchema } from "../shared/schemas";

const ContactSchemaWithLanguage = new Schema({
    name: LangSchema,
    contacType: {
        type: LangSchema,
        required: true
    },
    landLine: LangSchema,
    mobile: LangSchema,
    district: {
        type: LangSchema,
        required: true
    },
    province: {
        code: {
            type: Schema.Types.Number,
            required: true
        },
        name: {
            type: LangSchema,
            required: true
        }
    }
})

const ContactSchema = new Schema({
    name: Schema.Types.String,
    contactType: Schema.Types.String,
    landLine: [Schema.Types.String],
    mobile: [Schema.Types.String],
    openingTime: {
        type: Schema.Types.String,
        required: true
    },
    closingTime: {
        type: Schema.Types.String,
        required: true
    },
    district: {
        type: Schema.Types.String,
        required: true,
    },
    province: {
        type: Schema.Types.Number,
        required: true
    }
}, {
    timestamps: {
        createdAt: "createdDate",
        updatedAt: "updatedDate"
    }
})


const ContactModel = model("contact", ContactSchema, "contacts");


export default ContactModel;