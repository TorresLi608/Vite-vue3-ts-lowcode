<script lang="ts" setup>
import { pickBy, forEach } from 'lodash-es'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import initHotKeys from '@/plugins/hotkeys'
import { GlobalDataProps, ComponentData } from '@/types'
import defaultTextTemplates from '@/uitils/defaultTemplates'
import ComponentList from '@/components/ComponentList.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import LayerList from '@/components/LayerList.vue'
import EditorGroup from '@/components/EditorGroup.vue'
import PropsTable from '@/components/PropsTable.vue'
import HistoryArea from '@/views/editor/HistoryArea.vue'

initHotKeys()

const activeKey = ref('1')
const store = useStore<GlobalDataProps>()
const components = computed(() => {
  return store.state.editor.components
})

const page = computed(() => {
  return store.state.editor.page
})
const currentElement = computed<ComponentData | null>(() => {
  return store.getters.getCurrentElement
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

const handleChangePage = (e: any) => {
  store.commit('updatePage', e)
}

const updatePosition = (data: { id: string; top: number; left: number }) => {
  const { id } = data
  const updatedData = pickBy<number>(data, (v, k) => k !== 'id')
  const keyArr = Object.keys(updatedData)
  const valueArr = Object.values(updatedData)
  store.commit('updateComponent', {
    id,
    key: keyArr,
    value: valueArr.map((item) => item + 'px'),
  })
}

if (!store.state.editor.currentElement) {
  setActive(components.value[0].id)
}
</script>

<script lang="ts">
// 如果使用setUp糖语法 必须要手动注册一次组件 compontent 才会生效
// vscode 插件 使用Volar 更好的支持糖语法+ts 否则引入糖语法的组件会报错
import LText from '@/components/LText.vue'
import LImage from '@/components/LImage.vue'
import { object } from 'vue-types'
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
          <HistoryArea />
          <div class="preview-list" id="canvas-area">
            <div class="body-container" :style="page.props">
              <template v-for="component in components" :key="component.id">
                <EditWrapper
                  v-if="!component.isHidden"
                  :id="component.id"
                  :active="currentElement?.id === component.id"
                  :props="component.props"
                  @setActive="setActive"
                  @updatePosition="updatePosition"
                >
                  <component :is="component.name" v-bind="component.props" />
                </EditWrapper>
              </template>
            </div>
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
            <template v-if="currentElement?.props">
              <EditorGroup
                v-if="!currentElement.isLocked"
                :props="currentElement?.props"
                @change="handleChange"
              />
              <a-empty v-else>
                <template #description>
                  <p>该元素被锁定，无法编辑</p>
                </template>
              </a-empty>
            </template>
          </a-tab-pane>
          <a-tab-pane key="2" tab="图层设置" force-render>
            <LayerList
              :list="components"
              :selectedId="currentElement ? currentElement.id : ''"
              @change="handleChange"
              @select="setActive"
            />
          </a-tab-pane>
          <a-tab-pane key="3" tab="页面设置">
            <PropsTable
              :props="page.props"
              @change="handleChangePage"
            ></PropsTable>
          </a-tab-pane>
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
