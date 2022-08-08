import { createVNode, render } from 'vue'
import ContextMenu from '@/components/ContextMenu.vue'
export interface ActionItem {
  action: (componentId:string) => void
  text: string
  shortcut: string
}

const createContentMenu = (
  actions: ActionItem[],
  triggerClass = 'edit-wrapper'
) => {
  const container = document.createElement('div')
  const props = {
    actions,
    triggerClass
  }
  const vm = createVNode(ContextMenu, props)
  render(vm, container)
  document.body.appendChild(container)
  return ()=>{
    // 返回一个方法，在onUnmounted 的时候进行销毁
    render(null,container)
    document.body.removeChild(container)
  }
}
export default createContentMenu
