<template>
  <div
    ref="editWrapperRef"
    class="edit-wrapper"
    :class="{ active: active }"
    :style="styles"
    @click="onItemClick(id)"
    @mousedown="startMove"
  >
    <slot></slot>
      <div class="resizers">
      <div class='resizer top-left'  @mousedown.stop="startResize('top-left')"></div>
      <div class='resizer top-right'  @mousedown.stop="startResize('top-right')"></div>
      <div class='resizer bottom-left'  @mousedown.stop="startResize('bottom-left')"></div>
      <div class='resizer bottom-right' @mousedown.stop="startResize('bottom-right')"></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, nextTick } from 'vue'
import { pick } from 'lodash-es'
export default defineComponent({
  name: 'EditWrapper',
  props: {
    id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    props: {
      type: Object,
    },
  },
  emits: ['set-active', 'update-position'],
  setup(props, context) {
    const styles = computed(() =>
      pick(props.props, ['position', 'top', 'left', 'width', 'height'])
    )
    const editWrapperRef = ref<null | HTMLElement>(null)
    const onItemClick = (id: string) => {
      context.emit('set-active', id)
    }

    let isMoving = false
    const gap = {
      x: 0,
      y: 0,
    }

    const caculateMovePosition = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement
      const { clientX, clientY } = e
      const { x, y } = gap
      const left = clientX - x - container.offsetLeft
      const top = clientY - y - container.offsetTop
      return {
        left,
        top,
      }
    }

    const startMove = (e: MouseEvent) => {
      console.log(1)
      const currentElement = editWrapperRef.value
      if (!currentElement) return
      if (currentElement) {
        const { left, top } = currentElement.getBoundingClientRect()
        gap.x = e.clientX - left
        gap.y = e.clientY - top
      }
      const handleMove = (e: MouseEvent) => {
         console.log(2)
        isMoving = true
        const { left, top } = caculateMovePosition(e)
        if (currentElement) {
          currentElement.style.left = left + 'px'
          currentElement.style.top = top + 'px'
        }
      }

      const handleMouseUp = (e: MouseEvent) => {
         console.log(3)
        document.removeEventListener('mousemove', handleMove)
        if (isMoving) {
          const { left, top } = caculateMovePosition(e)
          context.emit('update-position', { id: props.id, top, left })
          isMoving = false
        }
        nextTick(() => {
          document.removeEventListener('mouseup', handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    const startResize = ()=>{

    }

    return {
      styles,
      editWrapperRef,
      onItemClick,
      startMove,
      startResize,
    }
  },
})
</script>

<style>
.edit-wrapper {
  padding: 0px;
  cursor: pointer;
  border: 1px solid transparent;
  user-select: none;
  box-sizing: content-box !important;
}
.edit-wrapper > * {
  position: static !important;
  /* width: 100% !important; */
  /* height: 100% !important; */
}
.edit-wrapper:hover {
  border: 1px dashed #ccc;
}
.edit-wrapper.hidden {
  display: none;
}
.edit-wrapper.active {
  border: 1px solid #1890ff;
  user-select: none;
  z-index: 1500;
}
.edit-wrapper .resizers {
  display: none;
}
.edit-wrapper.active .resizers {
  display: block;
}
.edit-wrapper.active .resizers .resizer {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 3px solid #1890ff;
  position: absolute;
}
.edit-wrapper .resizers .resizer.top-left {
  left: -5px;
  top: -5px;
  cursor: nwse-resize;
}
.edit-wrapper .resizers .resizer.top-right {
  right: -5px;
  top: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-left {
  left: -5px;
  bottom: -5px;
  cursor: nesw-resize;
}
.edit-wrapper .resizers .resizer.bottom-right {
  right: -5px;
  bottom: -5px;
  cursor: nwse-resize;
}
</style>
