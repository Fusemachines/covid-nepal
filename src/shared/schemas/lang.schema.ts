import {
    Schema
} from "mongoose";


export const LangSchema = new Schema({
    ne: {
        type: Schema.Types.String
    },
    en: {
        type: Schema.Types.String,
        required: true
    }
}, {
    _id: false,
    id: false,
    timestamps: false,
    versionKey: false
})




