import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { ActionItem } from '@/components/createContentMenu'
import createContentMenu from '@/components/createContentMenu'

const initContextMenu = () => {
  const store = useStore()
  const actions: ActionItem[] = [
    {
      shortcut: 'ctrl+c',
      text: '复制图层',
      action: (componentId: string) => {
        store.commit('copyComponent', componentId)
      },
    },
    {
      shortcut: 'ctrl+v',
      text: '粘贴图层',
      action: (componentId: string) => {
        store.commit('pasteCopiedComponent', componentId)
      },
    },
    {
      shortcut: 'delete',
      text: '删除图层',
      action: (componentId: string) => {
        store.commit('deleteComponent', componentId)
      },
    },
    {
      shortcut: 'esc',
      text: '取消选中',
      action: () => {
        store.commit('setActive', '')
      },
    },
  ]
  let destroy:any;
  onMounted(() => {
    destroy = createContentMenu(actions)
  })
  onUnmounted(()=>{
      destroy()
  })
}

export default initContextMenu
