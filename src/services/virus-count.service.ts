import { VirusCountModel } from "../models/virus-count.model";


export class VirusCountService {
    getVirusCountsToday() {
        try {
            return VirusCountModel.findOne({}, {}, { sort: { 'createdAt': -1 } });
        } catch (error) {
            throw new Error(error);
        }
    }

    getLatestVirusCounts() {
        try {
            return VirusCountModel.find({}, {}, { sort: { 'createdAt': -1 } }).limit(4);
        } catch (error) {
            throw new Error(error);
        }
    }

    addVirusCount(data: object) {
        return VirusCountModel.create(data)
    }

    async update(id: string, data: object) {
        const oldRecord = await VirusCountModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean()
        const newRecord = { ...oldRecord, ...data }

        return VirusCountModel.findByIdAndUpdate(id, newRecord, { new: true })
    }

    delete(id: string) {
        return VirusCountModel.findByIdAndRemove(id)
    }

    async getVirusCountsWithPagination(page: number, size: number) {
        try {
            page = Number(page);
            size = Number(size);

            let query = VirusCountModel.find({});
            const data = await query.skip(page * size).limit(size).exec();

            const totalItems = await VirusCountModel.countDocuments({});
            const totalPages = Math.ceil(totalItems / size);

            return {
                meta: {
                    page,
                    size,
                    totalItems,
                    totalPages,
                },
                data
            }

        } catch (error) {
            throw new Error(error);
        }
    }

}