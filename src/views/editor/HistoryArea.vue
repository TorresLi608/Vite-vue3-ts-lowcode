<template>
  <div class="history-area">
    <div class="operation-list">
      <a-button shape="circle" @click="handleToGitHub">
        <template #icon><GithubOutlined /> </template>
      </a-button>
      <a-popover title="键盘操作" trigger="hover">
        <template #content>
          <ul class="ant-menu-light ant-menu-root ant-menu ant-menu-vertical">
            <li
              v-for="(action, index) in actions"
              :key="index"
              class="ant-menu-item"
            >
              <span class="item-text">{{ action.text }}</span>
              <span class="item-shortcut">{{ action.shortcut }}</span>
            </li>
          </ul>
        </template>
        <a-button shape="circle">
          <template #icon><InfoOutlined /> </template>
        </a-button>
      </a-popover>
      <a-tooltip>
        <template #title> 撤销 </template>
        <a-button
          shape="circle"
          @click="undoHistory"
          :disabled="undoIsDisabled"
        >
          <template #icon><UndoOutlined /> </template>
        </a-button>
      </a-tooltip>
      <a-tooltip>
        <template #title> 重做 </template>
        <a-button
          shape="circle"
          @click="redoHistory"
          :disabled="redoIsDisabled"
        >
          <template #icon><RedoOutlined /> </template>
        </a-button>
      </a-tooltip>
    </div>
    <!-- <li v-for="(item, index) in histories" :key="item.id">
      <span :class="{ bold: index === historyIndex}">{{item.type}} - {{item.data.key}}</span>
    </li> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import {
  RedoOutlined,
  UndoOutlined,
  InfoOutlined,
  GithubOutlined,
} from '@ant-design/icons-vue'
import { GlobalDataProps } from '@/types/global'
export default defineComponent({
  components: {
    RedoOutlined,
    UndoOutlined,
    InfoOutlined,
    GithubOutlined,
  },
  setup() {
    const actions = [
      {
        shortcut: 'ctrl+c',
        text: '复制图层',
      },
      {
        shortcut: 'ctrl+v',
        text: '粘贴图层',
      },
      {
        shortcut: 'delete',
        text: '删除图层',
      },
      {
        shortcut: 'esc',
        text: '取消选中',
      },
    ]
    const store = useStore<GlobalDataProps>()
    const histories = computed(() => store.state.editor.histories)
    const historyIndex = computed(() => store.state.editor.historyIndex)
    const undoIsDisabled = computed<boolean>(
      () => store.getters.checkUndoDisable
    )
    const redoIsDisabled = computed<boolean>(
      () => store.getters.checkRedoDisable
    )
    const handleToGitHub = ()=>{
      window.open('https://github.com/TorresLi608/Vite-vue3-ts-lowcode')
    }
    const undoHistory = () => {
      store.commit('undo')
    }
    const redoHistory = () => {
      store.commit('redo')
    }
    return {
      actions,
      histories,
      undoHistory,
      redoHistory,
      handleToGitHub,
      historyIndex,
      undoIsDisabled,
      redoIsDisabled,
    }
  },
})
</script>

<style lang="less" scoped>
.history-area {
  position: absolute;
  right: 0;
  z-index: 500;
}
.operation-list {
  width: 130px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.history-area .bold {
  font-weight: bold;
}
.ant-menu-item {
  display: flex;
  justify-content: space-between;
}
.ant-menu-item:hover {
  background: #efefef;
}
.ant-menu-item .item-shortcut {
  color: #ccc;
}
</style>

