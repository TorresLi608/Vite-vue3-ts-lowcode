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
      <div
        class="resizer top-left"
        @mousedown.stop="startResize('top-left')"
      ></div>
      <div
        class="resizer top-right"
        @mousedown.stop="startResize('top-right')"
      ></div>
      <div
        class="resizer bottom-left"
        @mousedown.stop="startResize('bottom-left')"
      ></div>
      <div
        class="resizer bottom-right"
        @mousedown.stop="startResize('bottom-right')"
      ></div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, nextTick } from 'vue'
import { pick } from 'lodash-es'
type ResizeDirection = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
interface OriginalPositions {
  left: number
  right: number
  top: number
  bottom: number
}
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

    const caculateSize = (
      direction: ResizeDirection,
      e: MouseEvent,
      positions: OriginalPositions
    ) => {
      const { clientX, clientY } = e
      const { left, right, top, bottom } = positions
      const container = document.getElementById('canvas-area') as HTMLElement
      const rightWidth = clientX - left
      const leftWidth = right - clientX
      const bottomHeight = clientY - top
      const topHeight = bottom - clientY
      const topOffset = clientY - container.offsetTop + container.scrollTop
      const leftOffset = clientX - container.offsetLeft
      switch (direction) {
        case 'top-left':
          return {
            width: leftWidth,
            height: topHeight,
            top: topOffset,
            left: leftOffset,
          }
        case 'top-right':
          return {
            width: rightWidth,
            height: topHeight,
            top: topOffset,
          }
        case 'bottom-left':
          return {
            width: leftWidth,
            height: bottomHeight,
            left: leftOffset,
          }
        case 'bottom-right':
          return {
            width: rightWidth,
            height: bottomHeight,
          }
        default:
          break
      }
    }

    const caculateMovePosition = (e: MouseEvent) => {
      const container = document.getElementById('canvas-area') as HTMLElement
      const { clientX, clientY } = e
      const { x, y } = gap
      const left = clientX - x - container.offsetLeft
      const top = clientY - y - container.offsetTop + container.scrollTop
      return {
        left,
        top,
      }
    }

    const startMove = (e: MouseEvent) => {
      const currentElement = editWrapperRef.value
      if (!currentElement) return
      onItemClick(props.id)
      if (currentElement) {
        const { left, top } = currentElement.getBoundingClientRect()
        gap.x = e.clientX - left
        gap.y = e.clientY - top
      }
      const handleMove = (e: MouseEvent) => {
        isMoving = true
        const { left, top } = caculateMovePosition(e)
        if (currentElement) {
          currentElement.style.left = left + 'px'
          currentElement.style.top = top + 'px'
        }
      }

      const handleMouseUp = (e: MouseEvent) => {
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

    const startResize = (direction: ResizeDirection) => {
      const currentElement = editWrapperRef.value
      if (!currentElement) return
      const { left, right, top, bottom } =
        currentElement.getBoundingClientRect()
      const handleMove = (e: MouseEvent) => {
        const size = caculateSize(direction, e, { left, right, top, bottom })
        const { style } = currentElement
        if (size) {
          style.width = size.width + 'px'
          style.height = size.height + 'px'
          if (size.left) {
            style.left = size.left + 'px'
          }
          if (size.top) {
            style.top = size.top + 'px'
          }
        }
      }
      const handleMouseUp = (e:MouseEvent) => {
        document.removeEventListener('mousemove', handleMove)
        const size = caculateSize(direction, e, { left, right, top, bottom })
        context.emit('update-position', { ...size, id: props.id })
        nextTick(()=>{
          document.removeEventListener('mouseup',handleMouseUp)
        })
      }
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleMouseUp)
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
  width: 100% !important;
  height: 100% !important;
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
  width: 0 !important;
  height: 0 !important;
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
