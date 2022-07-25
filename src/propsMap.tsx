import { VNode,h } from 'vue'
import { TextComponentProps } from '@/defaultProps'

export interface PropToForm {
  component: string
  subComponent?: string
  value?: string
  valueProp?: string
  text?: string
  extraProps?: { [key: string]: any }
  options?: { text: string | VNode; value: any }[]
  intialTransform?: (v: any) => any
  afterTransform?: (v: any) => any
  eventName?: string
  events?: { [key: string]: (e: any) => void }
}

const fontFamilyArr = [
  { text: '宋体', value: '"SimSun","STSong"' },
  { text: '黑体', value: '"SimHei","STHeiti"' },
  { text: '楷体', value: '"KaiTi","STKaiti"' },
  { text: '仿宋', value: '"FangSong","STFangsong"' },
]

// h 函数方式
// const fontFamilyOptions = fontFamilyArr.map(item=>{
//   return {
//     text:h('span',{style:{ fontFamily:item.value }},item.text),
//     value:item.text
//   }
// })

// jsx 方式
const fontFamilyOptions = fontFamilyArr.map(item=>{
  return {
    text:<span style={{fontFamily:item.value}}>{item.text}</span>,
    value:item.value
  }
})


export type PropsToForms = {
  [P in keyof TextComponentProps]?: PropToForm
}

export const mapPropsToForms: PropsToForms = {
  text: {
    text: '文本',
    component: 'a-textarea',
    extraProps: { rows: 3 },
    afterTransform: (e: any) => e.target.value,
  },
  fontSize: {
    text: '字号',
    component: 'a-input-number',
    intialTransform: (v: string) => parseInt(v),
    afterTransform: (e: number) => (e ? `${e}px` : ''),
  },
  lineHeight: {
    text: '行高',
    component: 'a-slider',
    extraProps: { min: 0, max: 3, step: 0.1 },
    intialTransform: (v: string) => parseFloat(v),
    afterTransform: (e: number) => e.toString(),
  },
  textAlign: {
    text: '对齐',
    component: 'a-radio-group',
    subComponent: 'a-radio-button',
    options: [
      { value: 'left', text: '左' },
      { value: 'center', text: '中' },
      { value: 'right', text: '右' },
    ],
    afterTransform: (e: any) => e.target.value,
  },
  fontFamily: {
    component: 'a-select',
    subComponent: 'a-select-option',
    text: '字体',
    options: [
      { value: '', text: '无' },
      ...fontFamilyOptions,
    ],
  },
}
