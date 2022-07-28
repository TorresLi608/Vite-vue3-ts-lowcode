<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { GlobalDataProps, ComponentData } from '@/types'
import { defaultTextTemplates } from '@/uitils/defaultTemplates'
import ComponentList from '@/components/ComponentList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import PropsTable from '@/components/PropsTable.vue'
import LayerList from '@/components/LayerList.vue'

const activeKey = ref('1')
const store = useStore<GlobalDataProps>()
const components = computed(() => {
  return store.state.editor.components
})
const currentElement = computed<ComponentData | null>(() => {
  return store.getters.getCurrentElement || components.value[0]
})

const defaultList = ref<any[]>(defaultTextTemplates)

const onItemClick = (item: ComponentData) => {
  store.commit('addComponent', item)
}

const setActive = (id: string) => {
  store.commit('setActive', id)
}

const handleChange = (e: any) => {
  store.commit('updateComponent', e)
}
</script>

<script lang="ts">
// 如果使用setUp糖语法 必须要手动注册一次组件 compontent 才会生效
// vscode 插件 使用Volar 更好的支持糖语法+ts 否则引入糖语法的组件会报错
import LText from '@/components/LText.vue'
import LImage from '@/components/LImage.vue'
export default {
  components: {
    LText,
    LImage,
  },
}
</script>

<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          <ComponentList :list="defaultList" @onItemClick="onItemClick" />
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <div class="preview-list" id="canvas-area">
            <EditWrapper
              v-for="component in components"
              :key="component.id"
              :id="component.id"
              :active="currentElement?.id === component.id"
              @setActive="setActive(component.id)"
            >
              <component :is="component.name" v-bind="component.props" />
            </EditWrapper>
          </div>
        </a-layout-content>
      </a-layout>
      <a-layout-sider
        width="300"
        style="background: #fff"
        class="settings-panel"
      >
        <a-tabs v-model:activeKey="activeKey" centered>
          <a-tab-pane key="1" tab="属性设置">
            <PropsTable
              v-if="currentElement?.props"
              :props="currentElement?.props"
              @change="handleChange"
          /></a-tab-pane>
          <a-tab-pane key="2" tab="图层设置" force-render>
            <LayerList v-if="currentElement"  :list="components" :selectedId="currentElement ? currentElement.id : ''" />
          </a-tab-pane>
          <a-tab-pane key="3" tab="页面设置">页面设置</a-tab-pane>
        </a-tabs>
      </a-layout-sider>
    </a-layout>
  </div>
</template>

<style lang="less" scoped>
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
