<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps } from '@/types'
import { defaultTextTemplates } from '@/defaultTemplates'
const store = useStore<GlobalDataProps>();
const components = computed(()=>{
  return store.state.editor.components
})
</script>

<script lang="ts">
// 如果使用setUp糖语法 必须要手动注册一次组件 compontent 才会生效
// vscode 插件 使用Volar 更好的支持糖语法+ts 否则引入糖语法的组件会报错
import LText from '@/components/LText.vue'
import ComponentList from '@/components/componentList.vue'
export default {
  components: {
    LText,
    ComponentList
  }
}
</script>

<template>
<div class="editor-container">
  <a-layout>
    <a-layout-sider width="300" style="background: #fff">
      <div class="sidebar-container">
        <component-list :list="defaultTextTemplates" />
      </div>
    </a-layout-sider>
    <a-layout style="padding: 0 24px 24px">
      <a-layout-content class="preview-container">
        <p>画布区域</p>
        <div class="preview-list" id="canvas-area">
         <component v-for="component in components" :key="component.id" :is="component.name"  v-bind="component.props"/>
        </div>
      </a-layout-content>
    </a-layout>
    <a-layout-sider width="300" style="background: #fff" class="settings-panel">
      组件属性
    </a-layout-sider>  
  </a-layout>
</div>
</template>

<style>
.editor-container .preview-container {
  padding: 24px;
  margin: 0;
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.editor-container .preview-list {
  padding: 0;
  margin: 0;
  min-width: 375px;
  min-height: 200px;
  border: 1px solid #efefef;
  background: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  margin-top: 50px;
  max-height: 80vh;
}
.page-title {
  display: flex;
}
.page-title .inline-edit span {
  font-weight: 500;
  margin-left: 10px;
  font-size: 16px;
}
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>