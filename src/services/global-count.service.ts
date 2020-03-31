import { GlobalCountModel } from "../models/global-count.model";
import { IGlobalCount } from "../shared/interfaces/global-count.interface";

export class GlobalCountService {
  async getLatestCount() {
    return await GlobalCountModel.findOne({}).sort({ 'createdAt': 'desc' }).exec();
  }

  async add(data: IGlobalCount) {
    let date = new Date();

    date.setUTCHours(0, 0, 0, 0);
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const latestCount = await GlobalCountModel.findOne({ createdAt: { $gte: previousDate, $lte: date } }).exec();

    const nepalCount = new GlobalCountModel({
      recoveredTotal: data.recoveredTotal,
      confirmedTotal: data.confirmedTotal,
      deathTotal: data.deathTotal,
      confirmedToday: latestCount ? data.confirmedTotal - latestCount.get('confirmedTotal') : 0,
      recoveredToday: latestCount ? data.recoveredTotal - latestCount.get('recoveredTotal') : 0,
      deathToday: latestCount ? data.deathTotal - latestCount.get('deathTotal') : 0,
    })

    return await GlobalCountModel.create(nepalCount);
  }

  async update(id: string, data: IGlobalCount) {
    let nepalCount = await GlobalCountModel.findById(id).exec();

    let date = nepalCount.get('createdAt');
    date.setUTCHours(0, 0, 0, 0);
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const previousCount = await GlobalCountModel.findOne({ createdAt: { $gte: previousDate, $lte: date } }).exec();

    let count: any = {}
    count = { ...count, ...data };

    if (previousCount != undefined) {
      count.confirmedToday = data.confirmedTotal - previousCount.get('confirmedTotal');
      count.recoveredToday = data.recoveredTotal - previousCount.get('recoveredTotal');
      count.deathToday = data.deathTotal - previousCount.get('deathTotal');
    }

    await GlobalCountModel.findByIdAndUpdate(id, count).lean().exec();

    return await GlobalCountModel.findById(id).lean().exec();
  }

  async getCountsWithPagination(page: number, size: number) {
    page = Number(page);
    size = Number(size);

    let query = GlobalCountModel.find({});
    const data = await query.skip(page * size).limit(size).exec();

    const totalItems = await GlobalCountModel.countDocuments({}).exec();
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
  }
}
