import { Module } from 'vuex'
import { ComponentData, EditorProps, GlobalDataProps } from '@/types'
import {
  textDefaultProps,
  imageDefaultProps,
  AllComponentProps,
} from '@/uitils/defaultProps'
import { v4 as uuidv4 } from 'uuid'

const components: ComponentData[] = [
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: 'hello1',
      fontSize: '20',
      color: '#fa541c',
      textAlign: 'left',
      fontFamily: '',
    },
    isLocked: false,
    isHidden: false,
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: {
      ...textDefaultProps,
      text: 'hello2',
      fontSize: '15',
      textAlign: 'right',
      fontFamily: '',
      lineHeight: '1',
    },
    isLocked: false,
    isHidden: false,
  },
  {
    id: uuidv4(),
    name: 'l-text',
    props: { ...textDefaultProps, text: 'hello3', fontSize: '10' },
    isLocked: false,
    isHidden: false,
  },
  {
    id: uuidv4(),
    name: 'l-image',
    props: {
      ...imageDefaultProps,
      src: 'https://img2.baidu.com/it/u=3908142881,2459234098&fm=253&fmt=auto&app=138&f=JPEG',
      width: '300px',
    },
    isLocked: false,
    isHidden: false,
  },
]

const pageDefaultProps = {
  backgroundColor: '#ffffff',
  backgroundImage: 'url("https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202003%2F30%2F20200330084409_gxmqo.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1661925311&t=11a616e6a6b017526b6ecb1f460f6162")',
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
  },
}

export default editor
