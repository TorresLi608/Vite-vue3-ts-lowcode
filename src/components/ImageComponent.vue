<template>
  <div class="image-component">
    <div class="component-item">
      <StyleUploader @success="onImageUploaded" @error="upLoadError" />
    </div>
    <div class="component-item">
      <a-button
        type="primary"
        size="large"
        class="uploader-container"
        @click="handleClickAddImage"
        >添加图片</a-button
      >
    </div>
  </div>
</template>
<script lang="ts">
import { message } from 'ant-design-vue'
import { v4 as uuidv4 } from 'uuid'
import { defineComponent } from 'vue'
import StyleUploader from '@/components/StyleUploader.vue'
import { ComponentData, UploadResp, UploadError } from '@/types'
import { imageDefaultProps } from '@/uitils/defaultProps'
import { getImageDimensions } from '@/uitils/helper'

export default defineComponent({
  name: 'ImageComponent',
  components: {
    StyleUploader,
  },
  emits: ['on-item-click'],
  setup(props, { emit }) {
    const onImageUploaded = async (resp: UploadResp) => {
      const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps,
        },
      }
      componentData.props.src = resp.data.url
      const { width } = await getImageDimensions(resp.data.url)
      const maxWidth = 373
      componentData.props.width = (width > maxWidth ? maxWidth : width) + 'px'
      message.success('上传成功')
      emit('on-item-click', componentData)
    }

    const upLoadError = (data: UploadError) => {
      message.error(data.error.message)
    }

    const handleClickAddImage = () => {
      const componentData: ComponentData = {
        name: 'l-image',
        id: uuidv4(),
        props: {
          ...imageDefaultProps,
        },
      }
      emit('on-item-click', componentData)
    }
    return {
      onImageUploaded,
      upLoadError,
      handleClickAddImage,
    }
  },
})
</script>
<style lang="less" scoped>
.image-component {
  .component-item {
    margin-bottom: 15px;
  }
  .uploader-container {
    width: 100px;
    padding: 10px;
    color: #ffffff;
    background: #1890ff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }
  .uploader-container:hover {
    background: #40a9ff;
  }
  .uploader-container h4 {
    color: #ffffff;
    margin-bottom: 0;
    margin-left: 10px;
  }
  .uploader-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
