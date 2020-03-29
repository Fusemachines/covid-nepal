import { NepalCountModel } from "../models/nepal-count.model";
import { INepalCount } from "../shared/interfaces";


export class NepalCountService {

  async getLatestCount() {
    return await NepalCountModel.findOne({}).sort({ 'createdAt': 'desc' }).exec();
  }

  async addNepalCount(data: INepalCount) {
    let date = new Date();
    // await this.validateNepalCount(date);

    date.setUTCHours(0, 0, 0, 0);
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const latestCount = await NepalCountModel.findOne({ createdAt: { $gte: previousDate, $lte: date } }).exec();

    const nepalCount = new NepalCountModel({
      testedTotal: data.testedTotal,
      recoveredTotal: data.recoveredTotal,
      confirmedTotal: data.confirmedTotal,
      deathTotal: data.deathTotal,
      testedToday: latestCount != undefined ? data.testedTotal - latestCount.get('testedTotal') : 0,
      confirmedToday: latestCount != undefined ? data.confirmedTotal - latestCount.get('confirmedTotal') : 0,
      recoveredToday: latestCount != undefined ? data.recoveredTotal - latestCount.get('recoveredTotal') : 0,
      deathToday: latestCount != undefined ? data.deathTotal - latestCount.get('deathTotal') : 0,
    })

    return await NepalCountModel.create(nepalCount);
  }

  async updateNepalCount(id: string, data: INepalCount) {
    let nepalCount = await NepalCountModel.findById(id).exec();

    let date = nepalCount.get('createdAt');
    date.setUTCHours(0, 0, 0, 0);
    const previousDate = new Date(date);
    previousDate.setDate(previousDate.getDate() - 1);
    const previousCount = await NepalCountModel.findOne({ createdAt: { $gte: previousDate, $lte: date } }).exec();

    let count: any = {}
    count = { ...count, ...data };

    if (previousCount != undefined) {
      count.testedToday = data.testedTotal - previousCount.get('testedTotal');
      count.confirmedToday = data.confirmedTotal - previousCount.get('confirmedTotal');
      count.recoveredToday = data.recoveredTotal - previousCount.get('recoveredTotal');
      count.deathToday = data.deathTotal - previousCount.get('deathTotal');
    }

    await NepalCountModel.findByIdAndUpdate(id, count).lean().exec();

    return await NepalCountModel.findById(id).lean().exec();
  }

  private async validateNepalCount(date: Date) {
    if (date > new Date()) {
      throw Error("Cannot create for future date.");
    }

    date.setUTCHours(0, 0, 0, 0);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const counts = await NepalCountModel.find({ createdAt: { $gte: date, $lte: nextDate } }).lean().exec();

    if (counts != undefined && counts.length > 0) {
      throw Error("A record for the selected date already exists. Please update the record.");
    }
  }
}