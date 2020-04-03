import { INews } from "../shared/interfaces/news.interface";
import { NewsModel } from "../models/news.model";

export class NewsService {

  async add(data: INews) {
    const news = new NewsModel({
      title: data.title,
      url: data.url,
      imageUrl: data.imageUrl,
      uploadedAt: data.uploadedAt,
      description: data.description,
      type: data.type,
      source: data.source
    });

    return await NewsModel.create(news);
  };

  async update(id: string, data: INews) {
    return await NewsModel.findByIdAndUpdate(id, data).lean().exec();
  }

  async getWithPagination(type: string, page: number, size: number) {
    page = Number(page);
    size = Number(size);

    const news = await NewsModel.find({ 'type': type })
      .skip(page * size)
      .limit(size)
      .lean().exec();

    const totalItems = await NewsModel.countDocuments({'type': type}).exec();
    const totalPages = Math.ceil(totalItems / size);

    return {
      meta: {
        page,
        size,
        totalItems,
        totalPages
      },
      docs: news
    }
  }

  async getTips() {
    return await NewsModel.find({ 'type': 'TIP' }).lean().exec();
  }

  async getTop() {
    return await NewsModel.findOne({ 'type': 'TOP' }).sort({ 'createdAt': 'desc' }).lean().exec();
  }

  async getById(id: string) {
    return await NewsModel.findById(id).lean().exec();
  }

  async deleteById(id: string) {
    await NewsModel.findByIdAndDelete(id).lean().exec();
  }
}