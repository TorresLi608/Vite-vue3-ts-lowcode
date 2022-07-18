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


export interface UserSProps {
  isLogin: boolean,
  userName?: string
}

export interface ComponentData {
  props:{[key:string]:any},
  id:string,
  name:string

}
export interface EditorProps {
  components:ComponentData[],
  currentElement:string
}

export interface GlobalDataProps {
  users:UserSProps,
  templates:TemplatesProps,
  editor:EditorProps,
}