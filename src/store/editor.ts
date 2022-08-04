import { Module } from 'vuex'
import { cloneDeep } from 'lodash-es'
import { v4 as uuidv4 } from 'uuid'
import { message } from 'ant-design-vue'
import store from './index'
import { ComponentData, EditorProps, GlobalDataProps } from '@/types'
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
  },
  getters: {
    getCurrentElement(state) {
      return state.components.find((item) => state.currentElement === item.id)
    },
  },
  mutations: {
    addComponent(state, component: ComponentData) {
      state.components.push(component)
    },
    setActive(state, id: string) {
      state.currentElement = id
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
    },
    deleteComponent(state, id) {
      const currentComponent = state.components.find((item) => item.id === id)
      if (currentComponent) {
        state.components = state.components.filter((item) => item.id !== id)
      }
    },
    moveComponent(state, data: { direction: MoveDirection; amount: number; id: string }) {
      const currentComponent = state.components.find((component) => component.id === data.id)
      if (currentComponent) {
        const oldTop = parseInt(currentComponent.props.top || '0')
        const oldLeft = parseInt(currentComponent.props.left || '0')
        const { direction, amount } = data
        switch (direction) {
          case 'Up': {
            const newValue = oldTop - amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, id: data.id })
            break
          }
          case 'Down': {
            const newValue = oldTop + amount + 'px'
            store.commit('updateComponent', { key: 'top', value: newValue, id: data.id })
            break
          }
          case 'Left': {
            const newValue = oldLeft - amount + 'px'
            store.commit('updateComponent', { key: 'left', value: newValue, id: data.id })
            break
          }
          case 'Right': {
            const newValue = oldLeft + amount + 'px'
            store.commit('updateComponent', { key: 'left', value: newValue, id: data.id })
            break
          }

          default:
            break
        }
      }
    },
    updateComponent(state, { key, value, id, isRoot }) {
      const updateComponent = state.components.find(
        (item) => item.id === (id || state.currentElement)
      )
      if (updateComponent) {
        if (isRoot) {
          ;(updateComponent as any)[key] = value
          return
        }
        updateComponent.props[key as keyof AllComponentProps] = value
      }
    },
    updatePage(state, { key, value }) {
      state.page.props[key as keyof PageProps] = value
    },
  },
}

export default editor
