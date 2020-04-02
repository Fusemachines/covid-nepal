import { RequestModel, SupporterModel } from "../models/frontline.model";
import { getPagination, getSorting } from "../shared/utils";
import { ESortOrder } from "../shared/interfaces/http.interface";
import { filter } from "compression";


export class FrontlineService {

    private supporterModel = SupporterModel;
    private requestModel = RequestModel;


    // Get Help Requests
    async getRequests(query: {
        size: number;
        page: number;
        order: ESortOrder;
        orderBy: string;
        name: string;
        items: string;
    }) {

        const filters: any = {};

        if (query.name) {
            filters["name"] = new RegExp(query.name, 'gi')
        }

        if (query.items) {
            const items = query.items.split(",");
            filters["requestedItems"] = ":"
        }


        const result = await this.requestModel.paginate(
            filters,
            {
                select: "-__v",
                lean: true,
                populate: ["fulfilledBy"],
                ...getPagination(query),
                ...getSorting(query)
            }
        );
        return result;

    }

    // Get Supporters
    async getSupporters(query: {
        size: number;
        page: number;
        order: ESortOrder;
        orderBy: string;
    }) {

        const filters = {};

        const result = await this.supporterModel.paginate(
            filters,
            {
                select: "-__v",
                lean: true,
                ...getPagination(query),
                ...getSorting(query)
            }
        );
        return result
    }



    async createRequest(data: any) {
        const result = this.requestModel.create(data);
        return result;
    }


    async createSupporter(data: any) {
        const result = await this.supporterModel.create(data);
        return result;
    }


    async updateSupporter(id: string, data: any) {

        const updateData: any = {};

        if (data.contact) {
            for (let key in data.contact) {
                if (data.contact[key] !== undefined) {
                    updateData.contact[key] = data.contact[key]
                }
            }
        }


        return await this.supporterModel.findByIdAndUpdate({ _id: id }, {
            ...updateData
        }, {
            new: true
        })
    }



}