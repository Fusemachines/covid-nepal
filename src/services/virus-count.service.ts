import { VirusCountModel } from "../models/virus-count.model";


export class VirusCountService {

    getVirusCountsToday() {
        try {
            return VirusCountModel.findOne({}, {}, { sort: { '_id' : 1 } } );
        } catch (error) {
            throw new Error(error);
        }
    }

}