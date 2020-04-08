import { RequestModel, SupporterModel } from "../models/frontline.model";
import { getPagination, getSorting } from "../shared/utils";
import { ESortOrder } from "../shared/interfaces/http.interface";

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
            filters["requestedItems"] = {
                $in: items
            }
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
        items: string;
        name: string;
    }) {

        const filters: any = {};
        if (query.items) {
            const items = query.items.split(",");
            filters["providedItems"] = {
                $in: items
            }
        }

        if (query.name) {
            filters["name"] = new RegExp(query.name, 'gi')
        }

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


    async getSupporterById(id: string) {
        const supporter = await this.supporterModel.findById(id);
        return supporter;
    }

    async getRequestById(id: string) {
        const request = await this.requestModel.findById(id).populate("fulfilledBy").lean();
        return request;
    }

    async deleteSupporterById(id: string) {
        return await this.supporterModel.findByIdAndRemove(id);
    }

    async deleteRequestById(id: string) {
        return await this.requestModel.findByIdAndRemove(id);
    }


    async createRequest(data: any) {
        const result = this.requestModel.create(data);
        return result;
    }


    async createSupporter(data: any) {
        const result = await this.supporterModel.create(data);
        return result;
    }


    async updateSupporter(id: string, { contact, ...rest }: any) {

        let updateData: any = {};
        if (contact) {
            for (let key in contact) {
                if (contact[key] !== undefined) {
                    updateData[`contact.${key}`] = contact[key]
                }
            }
        }

        updateData = { ...updateData, ...rest }
        return await this.supporterModel.findByIdAndUpdate({ _id: id }, {
            $set: updateData
        }, {
            new: true
        })
    }


    async updateRequest(id: string, { contact, ...rest }: any) {

        let updateData: any = {};

        if (contact) {
            for (let key in contact) {
                if (contact[key] !== undefined) {
                    updateData[`contact.${key}`] = contact[key]
                }
            }
        }

        updateData = { ...updateData, ...rest }
        return await this.requestModel.findByIdAndUpdate({ _id: id }, {
            $set: updateData
        }, {
            new: true
        })
    }


    async getSupportersForDropdown() {
        const results = await this.supporterModel.find({}).select("_id name organization").lean().exec();
        return results;
    }

}