import HospitalModel from "../models/hospital.model";
import { getSorting, getPagination } from "../shared/utils";
import { IHospitalFilter } from "../shared/interfaces/hospital.interface";
import { ESortOrder } from "../shared/interfaces/http.interface";



export class HospitalService {
    createHospital(data: any) {
        // create slug
        if (!data.nameSlug) {
            data.nameSlug = data.name.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        }
        return HospitalModel.create(data);
    }

    async getHospitals(query?: { district: string, province: number, covidTest: string, order: ESortOrder, orderBy: string, size: number, page: number, lang: string }) {
        const queryDistrict = query.district && query.district.replace(/,+$/g, "").split(',') || []
        const provinceCode: number = (query.province && !isNaN(Number(query.province))) ? Number(query.province) : null;
        const { lang = "en" } = query;

        let covidTest = null;
        if (query.covidTest && ["true", "false"].includes(query.covidTest)) {
            covidTest = query.covidTest
        }

        // province filer
        let filter: any = {};
        if (provinceCode !== null) {
            filter = { ...filter, "province.code": provinceCode }
        }


        if (queryDistrict.length) {
            filter = { ...filter, district: { $in: queryDistrict } }
        }

        // covid test filter
        if (covidTest !== null) {
            filter = { ...filter, covidTest }
        }

        // query with pagination and sorting
        return await HospitalModel.paginate(filter, {
            lean: true,
            select: `
            name.${lang}
            nameSlug
            contact.${lang}
            hospitalType.${lang}
            availableTime.${lang}
            openDays.${lang}
            location.${lang}
            mapLink
            coordinates
            covidTest
            govtDesignated
            testingProcess.${lang}
            numIsolationBeds
            focalPoint.${lang}
            contact.${lang}
            province,
            district.${lang}
            `,
            ...getPagination(query),
            ...getSorting(query)
        });
    }

    getCovidHospitals() {
        return HospitalModel.find({
            covidTest: true
        }).sort({
            priority: -1
        }).select("name contact nameSlug availableTime openDays availableBeds totalBeds").lean();
    }

    getHospitalBySlug(slug: string) {
        return HospitalModel.find({
            nameSlug: slug
        }).select("-__v").lean();
    }

    deleteHospitalBySlug(slug: string) {
        return HospitalModel.findOneAndRemove({
            nameSlug: slug
        });
    }

    getHospitalById(id: string) {
        return HospitalModel.findById(id).select("-__v").lean();
    }

    async update(id: string, data: any) {
        const oldRecord: any = await HospitalModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean()

        // calculate nameSlug if name is present without nameSlug in request body
        if (data.name && !data.nameSlug) {
            const nameSlug = data.name.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            if (oldRecord.slug !== nameSlug) {
                data.nameSlug = nameSlug
            }
        }

        const newRecord = { ...oldRecord, ...data }
        return await HospitalModel.findByIdAndUpdate(id, newRecord, { new: true })
    }

    delete(id: string) {
        return HospitalModel.findByIdAndRemove(id)
    }
}
