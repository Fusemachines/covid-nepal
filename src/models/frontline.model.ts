import { Schema, model } from "mongoose";
import paginate from "../shared/plugins/pagination.plugin";


const RequestSchema = new Schema({

    name: {
        type: Schema.Types.String,
        required: true
    },
    contact: {
        email: {
            type: Schema.Types.String,
            required: true
        },
        mobile: Schema.Types.String,
        landLine: Schema.Types.String,
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
        ref: "supporter"
    }],
    requestedItems: [Schema.Types.String],
    others: Schema.Types.String
})

RequestSchema.plugin(paginate)

export const RequestModel = model("request", RequestSchema, "requests");

const SupporterSchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    contact: {
        email: Schema.Types.String,
        mobile: Schema.Types.String,
        landLine: Schema.Types.String,
        requiredPaths: ["email"]
    },
    organization: {
        type: Schema.Types.String,
        required: true
    },
    isVerified: Schema.Types.Boolean,
    location: Schema.Types.String,
    providedItems: [Schema.Types.String],
    others: Schema.Types.String,
})

SupporterSchema.plugin(paginate)

export const SupporterModel = model("supporter", SupporterSchema, "supporters")




