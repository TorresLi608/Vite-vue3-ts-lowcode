<template>
  <div class="background-processer">
    <style-uploader 
      v-if="!value"
      :value="value"
      @success="onImageUploaded"
    >
    </style-uploader>
    <image-processer
      v-else
      :value="value"
      @change="handleUploadUrl"
      :showDelete="true"
    >
    </image-processer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { message } from 'ant-design-vue'
import ImageProcesser from '@/components/ImageProcesser.vue'
import StyleUploader from '@/components/StyleUploader.vue'
import { UploadResp } from '@/types/extraType'
export default defineComponent({
  props: {
    value: {
      type: String,
      required: true
    }
  },
  components: {
    ImageProcesser,
    StyleUploader
  },
  emits: ['change'],
  setup (props, context) {
    const onImageUploaded = (data: {resp:UploadResp; file: File}) => {
      const { resp } = data
      message.success('上传成功')
      context.emit('change', resp.data.url)
    }
    const handleUploadUrl = (url: string) => {
      context.emit('change', url)
    }
    return {
      onImageUploaded,
      handleUploadUrl
    }
  }
})
</script>

<style>

</style>
