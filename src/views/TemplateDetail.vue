<script lang="ts" setup>
  import { computed,onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { useStore } from 'vuex'
  import { GlobalDataProps,TemplateProps} from '@/types'
  import { generateQRCode,downloadImage } from '@/uitils/helper'
  
  const route = useRoute();
  const store = useStore<GlobalDataProps>()
  const currentTemplateId = route.params.id as string
  const template = computed<TemplateProps>(()=>{
    return store.getters.getTemplateById(parseInt(currentTemplateId))
  })
  const handleDownLoadImage = ()=>{
    downloadImage(template.value.coverImg,template.value.title)
  }
  onMounted(()=>{
    generateQRCode('barcode-container',`${window.location.origin}/editor/preview/${currentTemplateId}`,150)
  })

</script>
<template>
  <div class="work-detail-container">
    <a-row type="flex" justify="center">
      <a-col :span="8" class="cover-img">
        <a :href="template.coverImg"><img :src="template.coverImg" alt="" id="cover-img"></a>
      </a-col>
      <a-col :span="8">
        <h2>{{template.title}}</h2>
        <p>{{template.desc}}</p>
        <div class="author">
          <a-avatar>V</a-avatar>
          该模版由 <b>{{template.author}}</b> 创作
        </div>
        <div class="bar-code-area">
          <span>扫一扫，手机预览</span>
          <canvas id="barcode-container"></canvas>
        </div>
        <div class="use-button">
          <router-link :to="{ name: 'editor', params: { id: currentTemplateId }}">
            <a-button type="primary" size="large"> 使用模版 </a-button>
          </router-link>
          <a-button size="large" @click="handleDownLoadImage"> 下载图片海报 </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.work-detail-container {
  margin-top: 50px;
}
.cover-img {
  margin-right: 30px;
}
.cover-img img {
  width: 100%;
}
.use-button {
  margin: 30px 0;
}
.ant-avatar {
  margin-right: 10px;
}
.bar-code-area {
  margin: 20px 0;
}
#barcode-container {
  display: block;
}
</style>
