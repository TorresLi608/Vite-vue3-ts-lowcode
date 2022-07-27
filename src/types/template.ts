export interface TemplateProps  {
  id:number,
  coverImg:string,
  author:string,
  title:string,
  desc:string,
  numberCount?:number,
}

export interface TemplatesProps  {
  data:TemplateProps[]
}