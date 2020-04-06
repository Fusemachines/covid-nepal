export default interface INotice {
    title: string,
    url: string,
    addedAt: Date,
    imageUrl: string,
    type: NewsType 
    tag: string,
  }
  
  enum NewsType {
    GOVERNMENT_NOTICE,
    RESOURCES,
    SUPPORTS
  }