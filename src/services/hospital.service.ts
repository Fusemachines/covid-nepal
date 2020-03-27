import HospitalModel from "../models/hospital.model";
import { getSorting, getPagination } from "../shared/utils";
import { IHospitalFilter } from "../shared/interfaces/hospital.interface";
import { ESortOrder } from "../shared/interfaces/http.interface";



export class HospitalService {
    createHospital(data: any) {
        // create slug
        if (data.name.length && !data.nameSlug) {
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
            filter = { ...filter, [`district.${lang}`]: query.district }
        }

        // covid test filter
        if (covidTest !== null) {
            filter = { ...filter, covidTest }
        }

        const total = await HospitalModel.countDocuments();

        const totalVerified = await HospitalModel.countDocuments({
            isVerified: true
        });

        // query with pagination and sorting
        const hospitals = await HospitalModel.paginate(filter, {
            lean: true,
            select: lang === "np" ? `
            -__v
            ` : `
            name.${lang}
            nameSlug
            contact.${lang}
            hospitalType.${lang}
            availableTime.${lang}
            openDays.${lang}
            location.${lang}
            mapLink
            totalBeds
            availableBeds
            numIsolationBeds
            isVerified
            coordinates
            covidTest
            icu
            ventilators
            govtDesignated
            testingProcess.${lang}
            focalPoint.${lang}
            contact.${lang}
            province
            district.${lang}
            `,
            ...getPagination(query),
            ...getSorting(query)
        });

        return {
            ...hospitals,
            totalHospitals: total,
            totalVerified: totalVerified,
            totalPending: total - totalVerified
        }
    }

    getCovidHospitals() {
        return HospitalModel.find({
            covidTest: true
        }).select("name contact nameSlug availableTime openDays availableBeds totalBeds").lean();
        // }).sort({
        //     priority: -1
        // }).select("name contact nameSlug availableTime openDays availableBeds totalBeds").lean();
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

    async getHospitalById(id: string) {
        return await HospitalModel.findById({
            _id: id
        }).select("-__v").lean();
    }

    async update(id: string, data: any) {
        const oldRecord: any = await HospitalModel.findById(id).select("-_id -createdAt -updatedAt -__v").lean()
        // calculate nameSlug if name is present without nameSlug in request body
        if (data.name.length && !data.nameSlug) {
            const nameSlug = data.name.trim().toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
            if (oldRecord.slug && oldRecord.slug !== nameSlug) {
                data.nameSlug = nameSlug
            }

            const newRecord = { ...oldRecord, ...data, province: { ...oldRecord.province, ...data.province } }
            return HospitalModel.findByIdAndUpdate(id, newRecord, { new: true })
        }
    }

    delete(id: string) {
        return HospitalModel.findByIdAndRemove(id)
    }

    deleteAll() {
        return HospitalModel.find({}).remove()
    }
}
