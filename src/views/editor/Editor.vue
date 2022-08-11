<template>
  <div class="editor-container">
    <a-layout>
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/"> 灵动一搭 </router-link>
          <inline-edit
            v-if="page.title"
            :value="page.title"
            @change="handleTitleChange"
          />
        </div>
        <a-menu
          :selectable="false"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">
            <a-button type="primary" @click="handleClickPrevewPage"
              >预览页面</a-button
            >
          </a-menu-item>
          <a-menu-item key="2">
            <a-button type="primary" @click="handleClickPrevew"
              >预览图片</a-button
            >
          </a-menu-item>
          <a-menu-item key="3">
            <a-button type="primary" @click="handleSave">保存</a-button>
          </a-menu-item>
          <a-menu-item key="4">
            <user-profile :user="userInfo"></user-profile>
          </a-menu-item>
        </a-menu>
      </a-layout-header>
    </a-layout>
    <a-layout>
      <a-layout-sider width="300" style="background: #fff">
        <div class="sidebar-container">
          <a-tabs v-model:activeKey="activeKeyLeft" centered>
            <a-tab-pane key="1" tab="文本组件">
              <ComponentList :list="defaultList" @onItemClick="onItemClick" />
              <img id="test-image" :style="{ width: '300px' }" />
            </a-tab-pane>
            <a-tab-pane key="2" tab="图片组件">
              <ImageComponent @on-item-click="onItemClick" />
            </a-tab-pane>
            <a-tab-pane key="3" tab="图表组件"> 后续开发。。。 </a-tab-pane>
          </a-tabs>
        </div>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="preview-container">
          <p>画布区域</p>
          <HistoryArea />
          <div
            class="preview-list"
            id="canvas-area"
            :class="{ 'canvas-fix': canvasFix }"
          >
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
        <a-tabs v-model:activeKey="activeKeyRight" centered>
          <a-tab-pane key="1" tab="属性设置">
            <template v-if="currentElement?.props">
              <EditorGroup
                v-if="!currentElement.isLocked"
                :props="((currentElement?.props) as any)"
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
  <PreviewEditorImage
    v-model:visible="isPreviewEditorImage"
    :src="previewSrc"
  />
</template>

<script lang="ts" setup>
import { pickBy, forEach } from 'lodash-es'
import { provide, computed, ref, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import html2canvas from 'html2canvas'
import initHotKeys from '@/plugins/hotkeys'
import initContextMenu from '@/plugins/contextMenu'
import { takeScreenshotAndUpload } from '@/uitils/helper'
import { GlobalDataProps, ComponentData } from '@/types'
import defaultTextTemplates from '@/uitils/defaultTemplates'
import InlineEdit from '@/components/InlineEdit.vue'
import UserProfile from '@/components/UserProfile.vue'
import ComponentList from '@/components/ComponentList.vue'
import ImageComponent from '@/components/ImageComponent.vue'
import EditWrapper from '@/components/EditWrapper.vue'
import LayerList from '@/components/LayerList.vue'
import EditorGroup from '@/components/EditorGroup.vue'
import PropsTable from '@/components/PropsTable.vue'
import PreviewEditorImage from '@/components/PreviewEditorImage.vue'
import HistoryArea from '@/views/editor/HistoryArea.vue'

provide('isEditor', true)
initHotKeys()
initContextMenu()
const activeKeyLeft = ref('1')
const activeKeyRight = ref('1')
const canvasFix = ref(false)
const isPreviewEditorImage = ref(false)
const previewSrc = ref('')
const defaultList = ref(defaultTextTemplates)
const store = useStore<GlobalDataProps>()
const route = useRoute()
const router = useRouter()
const currentTemplateId = route.params.id as string
const components = computed(() => {
  return store.state.editor.components
})

const page = computed(() => {
  return store.state.editor.page
})
const currentElement = computed<ComponentData | null>(() => {
  return store.getters.getCurrentElement
})

const userInfo = computed(() => store.state.users)

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

const handleTitleChange = (newTitle: string) => {
  store.commit('updatePage', { key: 'title', value: newTitle })
}

const generateImages = async () => {
  setActive('')
  const el = document.getElementById('canvas-area') as HTMLElement
  canvasFix.value = true
  await nextTick()
  // 1.生成图片在本地
  // 解决资源跨域问题
  html2canvas(el, { width: 375, useCORS: true, scale: 1 }).then((canvas) => {
    previewSrc.value = canvas.toDataURL()
    canvasFix.value = false
  })
  // 2.生成图片并上传
  // const resp = takeScreenshotAndUpload(el)
  // canvasFix.value = false
  // if(resp){
  // previewSrc.value = resp.data.url
  //    console.log(resp,'resp')
  // }
}
const handleSave = () => {
  console.log('保存。。。')
}

const handleClickPrevew = () => {
  isPreviewEditorImage.value = true
  generateImages()
}

const handleClickPrevewPage = () => {
  const newRuterPage = router.resolve({
    name: 'preview', // 跳转的页面路由
    params: {
      // 要传的参数
      id: currentTemplateId,
    },
  })
  if (newRuterPage) {
    window.open(newRuterPage.href, '_blank') // 打开新的窗口(跳转路径，跳转类型)
  }
}

if (!store.state.editor.currentElement && components.value.length) {
  setActive(components.value[0].id)
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
.page-title :deep(.inline-edit) {
  margin-left: 10px;
  span {
    font-weight: 500;
    font-size: 16px;
  }
}
// Canvas不支持box-shadow属性 所以保存图片的时候去掉该属性
.preview-list.canvas-fix .edit-wrapper > * {
  box-shadow: none !important;
}
// 解决1倍图时高度只有一半问题
.preview-list.canvas-fix {
  position: absolute;
  max-height: none;
}
</style>
