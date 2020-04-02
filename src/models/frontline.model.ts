import { Schema, model } from "mongoose";


const RequestSchema = new Schema({

    name: {
        type: Schema.Types.String,
        required: true
    },
    contact: {
        email: Schema.Types.String,
        contact: Schema.Types.String,
        requiredPaths: ["email", "contact"]
    },
    organization: {
        type: Schema.Types.String,
        required: true
    },
    location: {
        type: Schema.Types.String
    },
    isVerified: Schema.Types.Boolean,
    isFulfilled: Schema.Types.Boolean,
    fulfilledBy: [{
        type: Schema.Types.ObjectId,
        ref: "supporters"
    }],
    requestedItems: [Schema.Types.String],
    others: Schema.Types.String
})

export const RequestModel = model("request", RequestSchema, "requests");

const SupporterSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    contact: {
        email: Schema.Types.String,
        contact: Schema.Types.String,
        requiredPaths: ["email", "contact"]
    },
    organization: {
        type: Schema.Types.String,
        required: true
    },
    location: Schema.Types.String,
    providedItems: [Schema.Types.String],
    others: Schema.Types.String,
})


export const SupporterModel = model("supporter", SupporterSchema, "supporters")




