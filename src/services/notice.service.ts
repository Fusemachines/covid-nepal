import INotice from "../shared/interfaces/notice.interface";
import { NoticeModel } from "../models/notice.models";

export class NoticeService {

  add(data: INotice) {
    const news = {
        title: data.title,
        url: data.url,
        imageUrl: data.imageUrl,
        addedAt: data.addedAt,
        tag: data.tag,
        type: data.type
      }

    return NoticeModel.create(news);
  };

  update(id: string, data: INotice) {
    return NoticeModel.findByIdAndUpdate(id, data, { new: true });
  }

  async getWithPagination(type: string, page: number, size: number) {
    page = Number(page);
    size = Number(size);

    const news = await NoticeModel.find({ 'type': type })
      .skip(page * size)
      .limit(size)
      .lean().exec();

    const totalItems = await NoticeModel.countDocuments({'type': type}).exec();
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

  getByType(type: string) {
    return NoticeModel.find({
        type
    }).lean();
  }

  deleteById(id: string) {
    return NoticeModel.findByIdAndDelete(id).lean();
  }
}