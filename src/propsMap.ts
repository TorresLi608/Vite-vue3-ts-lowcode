import { TextComponentProps } from '@/defaultProps'

export interface PropToForm {
  component: string
  subComponent?:string
  value?: string
  text?:string
  extraProps?:{[key:string]:any},
  options?:{text:string,value:any}[]
}

export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForms: PropsToForms = {
  text: {
    text:"文本",
    component: 'a-textarea',
    extraProps:{ rows:3 }
  },
  fontSize:{
    text:"字号",
    component:'a-input-number'
  },
  lineHeight:{
    text:"行高",
    component:'a-slider',
    extraProps:{ min:0,max:10,setp:1}
  }
}
