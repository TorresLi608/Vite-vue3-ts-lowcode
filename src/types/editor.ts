export interface ComponentData {
  props: { [key: string]: any }
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
}
