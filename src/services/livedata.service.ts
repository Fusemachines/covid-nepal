import LiveDataModel from "../models/livedata.model";

export class LiveDataService {
    all() {
        return LiveDataModel.find().lean();
    }

    create(data: object) {
        return LiveDataModel.create(data)
    }

    update(id: string, data: object) {
        return LiveDataModel.findByIdAndUpdate(id, data)
    }

    delete(id: string) {
        return LiveDataModel.findByIdAndRemove(id)
    }
}