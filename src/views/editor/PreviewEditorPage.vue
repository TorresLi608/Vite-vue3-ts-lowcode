<template>
  <div class="preview-page">
    <div class="preview-container" :style="page.props">
      <component
        v-for="component in components"
        :key="component.id"
        :is="component.name"
        v-bind="component.props"
      />
    </div>

    <div class="copy-body">
      <a-input id="channel-url" :value="currentUrl" :readonly="true"></a-input>
      <a-button type="primary" data-clipboard-target="#channel-url" class="copy-button">复制链接</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import ClipboardJS from 'clipboard'
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue'
import { GlobalDataProps } from '@/types'
import LText from '@/components/LText.vue'
import LImage from '@/components/LImage.vue'

export default defineComponent({
  name: 'PreviewEditorPage',
  components: {
    LText,
    LImage,
  },
  setup() {
    const store = useStore<GlobalDataProps>()
    const currentUrl = ref<string>('')
    const components = computed(() => {
      return store.state.editor.components
    })
    const page = computed(() => {
      return store.state.editor.page
    })
    
    onMounted(() => {
      const clipboard = new ClipboardJS('.copy-button')
      clipboard.on('success',()=>{
        message.success('复制成功')
      })
      currentUrl.value = window.location.href
    })
    return {
      currentUrl,
      components,
      page,
    }
  },
})
</script>
<style lang="less" scoped>
.preview-page {
  width: 100%;
  background: #f0f2f5;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  .preview-container {
    position: relative;
    width: 375px;
    margin-top: 100px;
  }
  .copy-body{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
