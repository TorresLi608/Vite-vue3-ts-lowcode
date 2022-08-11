<template>
  <a-modal v-model:visible="visible" title="预览图片" okText="下载图片" cancelText="取消" @ok="handleOk" @cancel="handleCancel">
      <div class="preview-editor-image">
        <img :src="src" alt="" class="preview-image"/>
      </div>
    </a-modal>
</template>
<script lang="ts" setup>
import { defineProps,defineEmits,PropType } from 'vue'
import { downloadImage } from '@/uitils/helper'
import { PageData } from '@/types'
const props = defineProps({
  visible:{
    type:Boolean,
    default:false
  },
  src:{
    type:String,
    default:''
  },
  page:{
    type:Object as PropType<PageData>,
    default:()=>({})
  }
})
const emit = defineEmits(['update:visible'])
const handleOk = ()=>{
  downloadImage(props.src,props.page.title)
  emit('update:visible',false)
}

const handleCancel = ()=>{
  emit('update:visible',false)
}

</script>

<style>
.preview-editor-image{
  display: flex;
  justify-content: center;
}
.preview-editor-image .preview-image{
  width: 375px;
}

</style>