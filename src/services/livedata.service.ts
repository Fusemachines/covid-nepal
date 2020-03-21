import LiveDataModel from "../models/livedata.model";
import HospitalModel from "../models/hospital.model";
import { ECovidTest } from "../shared/interfaces";

export class LiveDataService {
    all(query?: { district: string, province: number, covidTest: ECovidTest }) {
        // const province: number = (query.province && !isNaN(Number(query.province))) ? Number(query.province) : 3;
        const queryDistrict = query.district && query.district.replace(/,+$/g, "").split(',') || []

        // query filter
        let filter: any = {};
        if (queryDistrict.length) {
            filter = { ...filter, district: { $in: queryDistrict } }
        }

        if (query.covidTest !== undefined && query.covidTest !== ECovidTest.ALL) {
            filter = { ...filter, covidTest: query.covidTest === ECovidTest.AVAILABLE ? true : false }
        }


        return HospitalModel.find(filter).lean();
    }

    findById(id: string) {
        return HospitalModel.findById(id)
    }

    create(data: object) {
        return HospitalModel.create(data)
    }

    async update(id: string, data: object) {
        const oldRecord = await HospitalModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean()
        const newRecord = { ...oldRecord, ...data }

        return HospitalModel.findByIdAndUpdate(id, newRecord, { new: true })
    }

    delete(id: string) {
        return HospitalModel.findByIdAndRemove(id)
    }
}