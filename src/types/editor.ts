import { AllComponentProps } from '@/uitils/defaultProps'

export interface pageData {
  props: { [key: string]: any }
  title?: string
}
export interface ComponentData {
  props: Partial<AllComponentProps>
  id: string
  name: string
  // 图层是否隐藏
  isHidden?: boolean
  // 图层是否锁定
  isLocked?: boolean
  // 图层名称
  layerName?: string
}
export interface EditorProps {
  components: ComponentData[]
  currentElement: string
  page:pageData
}


