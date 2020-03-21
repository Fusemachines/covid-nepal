import LiveDataModel from "../models/livedata.model";

export class LiveDataService {
    all(query?: { district: string, province: number }) {
        const province: number = (query.province && !isNaN(Number(query.province))) ? Number(query.province) : 3;
        const queryDistrict = query.district && query.district.replace(/,+$/g, "").split(',') || []

        // query filter
        let filter: any = { province };
        if (queryDistrict.length) {
            filter = { ...filter, district: { $in: queryDistrict } }
        }

        return LiveDataModel.find(filter).lean();
    }

    findById(id: string) {
        return LiveDataModel.findById(id)
    }

    create(data: object) {
        return LiveDataModel.create(data)
    }

    async update(id: string, data: object) {
        const oldRecord = await LiveDataModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean()
        const newRecord = { ...oldRecord, ...data }

        return LiveDataModel.findByIdAndUpdate(id, newRecord, { new: true })
    }

    delete(id: string) {
        return LiveDataModel.findByIdAndRemove(id)
    }
}