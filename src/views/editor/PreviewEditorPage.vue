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
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
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
    const components = computed(() => {
      return store.state.editor.components
    })
    const page = computed(() => {
      return store.state.editor.page
    })
    return {
      components,
      page,
    }
  },
})
</script>
<style lang="less" scoped>
.preview-page {
  background: #f0f2f5;
  min-height: 100vh;
  overflow: hidden;
  .preview-container {
    position: relative;
    width: 375px;
    margin: 0 auto;
    margin-top: 100px;
  }
}
</style>
