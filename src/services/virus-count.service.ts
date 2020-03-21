import { VirusCountModel } from "../models/virus-count.model";


export class VirusCountService {
    getVirusCountsToday() {
        try {
            return VirusCountModel.findOne({}, {}, { sort: { 'createdDate' : -1 } });
        } catch (error) {
            throw new Error(error);
        }
    }

    getLatestVirusCounts() {
        try {
            return VirusCountModel.find({}, {}, { sort: { 'createdDate' : -1 } }).limit(4);
        } catch (error) {
            throw new Error(error);
        }
    }

}