import { INews } from "../shared/interfaces/news.interface";
import { NewsModel } from "src/models/news.model";

export class NewsService {

  async add(data: INews) {
    const news = new NewsModel({
      title: data.title,
      url: data.url,
      imageUrl: data.imageUrl,
      uploadedAt: data.uploadedAt,
      description: data.description,
      type: data.type
    });

    return await NewsModel.create(news);
  };

  async getWithPagination(type: string, page: number, size: number) {
    page = Number(page);
    size = Number(size);
    
    const news = await NewsModel.find({ 'type': type })
      .skip(page * size)
      .limit(size)
      .lean().exec();

    const totalItems = await NewsModel.countDocuments({}).exec();
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
}