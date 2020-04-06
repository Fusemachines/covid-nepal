export interface INews {
  title: string,
  description: string,
  source: string,
  uploadedAt: Date,
  imageUrl: string,
  url: string,
  type: NewsType 
}

enum NewsType {
  NEPAL,
  GLOBAL,
  TOP,
  TIP
}