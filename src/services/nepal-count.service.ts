import { NepalCountModel } from "../models/nepal-count.model";
import { IAddNepalCount } from "../shared/interfaces/nepal-count.interface";

export class NepalCountService {

  async getLatestCounts() {
    return await NepalCountModel.findOne({}).sort({ 'createdAt': 'desc' }).exec();
  }

  async addNepalCount(data: IAddNepalCount) {
    await this.validateNepalCount(new Date(data.createdAt));

    let testedToday = 0;
    let confirmedToday = 0;
    let recoveredToday = 0;
    let deathToday = 0;

    const latestCount = await this.getLatestCounts();

    if (latestCount != undefined) {
      testedToday = data.testedTotal - latestCount.get('testedTotal');
      confirmedToday = data.confirmedTotal - latestCount.get('confirmedTotal');
      recoveredToday = data.recoveredTotal - latestCount.get('recoveredTotal');
      deathToday = data.deathTotal - latestCount.get('deathTotal');
    }

    const nepalCount = new NepalCountModel({
      testedTotal: data.testedTotal,
      recoveredTotal: data.recoveredTotal,
      confirmedTotal: data.confirmedTotal,
      deathTotal: data.deathTotal,
      testedToday,
      confirmedToday,
      recoveredToday,
      deathToday,
      createdAt: data.createdAt
    })

    return await NepalCountModel.create(nepalCount);
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