export interface TemplateProps  {
  id:number,
  coverImg:string,
  author:string,
  title:string,
  desc:string,
  numberCount?:number,
  isHot?:boolean
  isNew?:boolean
}

export interface TemplatesProps  {
  data:TemplateProps[]
}