<template>
  <div class="create-component-list">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="component-item"
      @click="onItemClick(item)"
    >
      <l-text :key="index" v-bind="item"></l-text>
    </div>
  </div>
  <StyleUploader @success="onImageUploaded"></StyleUploader>
</template>
<script lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { defineComponent,PropType } from 'vue'
import { message } from 'ant-design-vue'
import { TextComponentProps,imageDefaultProps } from '@/uitils/defaultProps'
import { ComponentData } from '@/types'
import { UploadResp } from '@/types/extraType'
import { getImageDimensions } from '@/uitils/helper'
import LText from '@/components/LText.vue'
import StyleUploader from '@/components/StyleUploader.vue'
export default defineComponent({
  name: 'component-list',
  components: { LText, StyleUploader },
  emits: ['on-item-click'],
  props: {
    list: {
      type: Array as PropType<TextComponentProps[]>,
      default: () => [],
    },
  },
  setup(props, context) {
    const onItemClick = (props: TextComponentProps) => {
      const componentData: ComponentData = {
        name: 'l-text',
        id: uuidv4(),
        props,
      }
      context.emit('on-item-click', componentData)
    }
    const onImageUploaded = async (resp: UploadResp) => {
       const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props:{
          ...imageDefaultProps,
        },
      }
      componentData.props.src = resp.data.url
      const { width } =  await getImageDimensions(resp.data.url)
      const maxWidth = 373
      componentData.props.width = ((width > maxWidth) ? maxWidth : width) + 'px'
      message.success('上传成功')
      context.emit('on-item-click', componentData)

    }
    return {
      onItemClick,
      onImageUploaded,
    }
  },
})
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
.component-item > * {
  position: static !important;
}
</style>
