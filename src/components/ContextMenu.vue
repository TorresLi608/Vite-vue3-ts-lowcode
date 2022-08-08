<template>
  <div class="context-menu-component menu-container" ref="menuRef">
    <ul class="ant-menu-light ant-menu-root ant-menu ant-menu-vertical">
      <li v-for="(action, index) in actions" :key="index"  @click="action.action(componentId)" class="ant-menu-item">
        <span class="item-text">{{ action.text }}</span>
        <span class="item-shortcut">{{ action.shortcut }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted,ref, PropType } from 'vue'
import { getParentElement } from '@/uitils/helper'
import { ActionItem } from '@/components/createContentMenu'


export default defineComponent({
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      required: true,
    },
    triggerClass: {
      type: String,
      default: 'edit-wrapper',
    },
  },
  setup(props, context) {
    const menuRef = ref<HTMLElement | null>(null)
    const componentId = ref('')
    const triggerContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const contextMenuDom = menuRef.value as HTMLElement
      const editWrapper = getParentElement(
        e.target as HTMLElement,
        props.triggerClass
      )
      if (editWrapper) {
        componentId.value = editWrapper.dataset.componentId || ''
        contextMenuDom.style.display = 'block'
        contextMenuDom.style.top = e.pageY + 'px'
        contextMenuDom.style.left = e.pageX + 'px'
      }
    }
    const handleClick= () => {
      const contextMenuDom = menuRef.value as HTMLElement
      contextMenuDom.style.display = 'none'
    }

    onMounted(()=>{
      document.addEventListener('contextmenu',triggerContextMenu)
      document.addEventListener('click',handleClick)
    })

    onUnmounted(()=>{
      document.removeEventListener("contextmenu",triggerContextMenu)
      document.removeEventListener("click",handleClick)
    })
    return {
      menuRef,
      componentId,
    }
  },
})
</script>

<style scoped>
.menu-container {
  display: none;
  position: absolute;
  background: #fff;
  z-index: 2000;
  width: 220px;
  border: 1px solid #ccc;
}
.menu-container .ant-menu-item {
  display: flex;
  justify-content: space-between;
}
.menu-container .ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>
