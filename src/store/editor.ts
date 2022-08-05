import { Module } from 'vuex'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'
import store from './index'
import { insertAt } from '@/uitils/helper'
import {
  pushHistory,
  pushHistoryDebounce,
  modifyHistory,
} from '@/uitils/edtor'
import {
  ComponentData,
  EditorProps,
  GlobalDataProps,
  HistoryProps,
  UpdateComponentData,
} from '@/types'
import {
  textDefaultProps,
  imageDefaultProps,
  AllComponentProps,
  PageProps,
} from '@/uitils/defaultProps'
export type MoveDirection = 'Up' | 'Down' | 'Left' | 'Right'

const components: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    layerName: '图层1',
    props: {
      ...textDefaultProps,
      text: 'hello1',
      fontSize: '20',
      color: '#fa541c',
      textAlign: 'left',
      fontFamily: '',
      width: '100px',
      height: '100px',
      backgroundColor: '#efefef',
      left: '30px',
      top: '30px',
    },
    isLocked: false,
    isHidden: false,
  },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   props: {
  //     ...textDefaultProps,
  //     text: 'hello2',
  //     fontSize: '15',
  //     textAlign: 'right',
  //     fontFamily: '',
  //     lineHeight: '1',
  //   },
  //   isLocked: false,
  //   isHidden: false,
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-text',
  //   props: { ...textDefaultProps, text: 'hello3', fontSize: '10' },
  //   isLocked: false,
  //   isHidden: false,
  // },
  // {
  //   id: uuidv4(),
  //   name: 'l-image',
  //   props: {
  //     ...imageDefaultProps,
  //     src: 'https://img2.baidu.com/it/u=3908142881,2459234098&fm=253&fmt=auto&app=138&f=JPEG',
  //     width: '300px',
  //   },
  //   isLocked: false,
  //   isHidden: false,
  // },
]

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage:
    'url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F30%2F20200330084409_gxmqo.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661925311&t=11a616e6a6b017526b6ecb1f460f6162")',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: '560px',
}

const editor: Module<EditorProps, GlobalDataProps> = {
  state: {
    components,
    currentElement: '',
    page: {
      title: 'Test',
      props: pageDefaultProps,
    },
    copiedComponent: undefined,
    histories: [],
    historyIndex: -1,
    cachedOldValues: null,
    maxHistoryNumber: 10,
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find((item) => state.currentElement === item.id)
    },
    checkUndoDisable: (state) => {
      if (state.histories.length === 0 || state.historyIndex === 0) {
        return true
      }
      return false
    },
    checkRedoDisable: (state) => {
      if (
        state.histories.length === 0 ||
        state.historyIndex === state.histories.length ||
        state.historyIndex === -1
      ) {
        return true
      }
      return false
    },
  },
  mutations: {
    setActive(state, id: string) {
      state.currentElement = id
    },
    undo(state) {
      if (state.historyIndex === -1) {
        state.historyIndex = state.histories.length - 1
      } else {
        state.historyIndex--
      }
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case 'add':
          state.components = state.components.filter(
            (item) => item.id !== history.componentId
          )
          break
        case 'delete':
          state.components = insertAt(
            state.components,
            history.index as number,
            history.data
          )
        case 'modify':
          modifyHistory(state, history, 'undo')
          break
        default:
          break
      }
    },
    redo(state) {
      if (state.historyIndex === -1) {
        return
      }
      const history = state.histories[state.historyIndex]
      switch (history.type) {
        case 'add':
          state.components.push(history.data)
          break
        case 'delete':
          state.components = state.components.filter(
            (component) => component.id !== history.componentId
          )
          break
        case 'modify': {
          modifyHistory(state, history, 'redo')
          break
        }
        default:
          break
      }
      state.historyIndex++
    },
    addComponent(state, component: ComponentData) {
      component.layerName = '图层' + (state.components.length + 1)
      state.components.push(component)
      pushHistory(state, {
        id: uuidv4(),
        componentId: component.id,
        type: 'add',
        data: cloneDeep(component),
      })
    },
    // 复制组件
    copyComponent(state, id: string) {
      const currentComponent = state.components.find((item) => item.id === id)
      if (currentComponent) {
        state.copiedComponent = currentComponent
        message.success('已拷贝当前图层', 1)
      }
    },
    // 粘贴组件
    pasteCopiedComponent(state) {
      const copiedComponent = state.copiedComponent
      if (!copiedComponent) return
      const clone = cloneDeep(copiedComponent)
      clone.id = uuidv4()
      clone.layerName = copiedComponent.layerName + '副本'
      state.components.push(clone)
      message.success('粘贴当前图层成功', 1)
      pushHistory(state, {
        id: uuidv4(),
        componentId: clone.id,
        type: 'add',
        data: cloneDeep(clone),
      })
    },
    deleteComponent(state, id) {
      const currentComponent = state.components.find((item) => item.id === id)
      if (currentComponent) {
        const currentIndex = state.components.findIndex(
          (item) => item.id === id
        )
        state.components = state.components.filter((item) => item.id !== id)
        pushHistory(state, {
          id: uuidv4(),
          componentId: currentComponent.id,
          type: 'delete',
          data: cloneDeep(currentComponent),
          index: currentIndex,
        })
      }
      message.success('删除成功', 1)
    },
    moveComponent(
      state,
      data: { direction: MoveDirection; amount: number; id: string }
    ) {
      const currentComponent = state.components.find(
        (component) => component.id === data.id
      )
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0')
        const oldLeft = parseInt(currentComponent.props.left || '0')
        const { direction, amount } = data
        switch (direction) {
          case 'Up': {
            const newValue = oldTop - amount + 'px'
            store.commit('updateComponent', {
              key: 'top',
              value: newValue,
              id: data.id,
            })
            break
          }
          case 'Down': {
            const newValue = oldTop + amount + 'px'
            store.commit('updateComponent', {
              key: 'top',
              value: newValue,
              id: data.id,
            })
            break
          }
          case 'Left': {
            const newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id: data.id,
            })
            break
          }
          case 'Right': {
            const newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', {
              key: 'left',
              value: newValue,
              id: data.id,
            })
            break
          }

          default:
            break
        }
      }
    },
    updateComponent(state, { key, value, id, isRoot }: UpdateComponentData) {
      const updateComponent = state.components.find(
        (item) => item.id === (id || state.currentElement)
      )
      if (updateComponent) {
        if (isRoot) {
          ;(updateComponent as any)[key as string] = value
        } else {
          const oldValue = Array.isArray(key)
            ? key.map((key) => updateComponent.props[key])
            : updateComponent.props[key]
          if (!state.cachedOldValues) {
            state.cachedOldValues = oldValue
          }
          pushHistoryDebounce(state, { key, value, id })
          if (Array.isArray(key) && Array.isArray(value)) {
            key.forEach(
              (keyName, index) =>
                (updateComponent.props[keyName] = value[index])
            )
          } else if (typeof key === 'string' && typeof value === 'string') {
            updateComponent.props[key as keyof AllComponentProps] = value
          }
        }
      }
    },
    updatePage(state, { key, value }) {
      state.page.props[key as keyof PageProps] = value
    },
  },
}

export default editor
