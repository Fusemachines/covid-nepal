import { Schema, model } from "mongoose";

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