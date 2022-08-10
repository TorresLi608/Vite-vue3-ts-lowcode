import { createStore,Store } from 'vuex'
import { GlobalDataProps } from '@/types'
import templates from './templates'
import users from './users' 
import editor from './editor'

const saveVuexPlugin = (store:Store<GlobalDataProps>) => {
  store.subscribe((mutation, state) => {
    // 这里因为没有后端，但是想将vuex的数据保存在localStoreage上面,没必要用开源插件就自己随便写了一个
    // 这留了一个坑,因为editor的modules没开命名空间所以只有将所有会改变editor里数据的方法都写进数组里，当方法触发的时候进行本地储存
    const isTriggerEditor = ['updatePage','updateComponent','moveComponent','deleteComponent','pasteCopiedComponent','copyComponent','addComponent','redo','undo'].includes(mutation.type)
    if(isTriggerEditor){
      window.localStorage.setItem('editor-vuex', JSON.stringify(state.editor))
    }
  })
}

const store = createStore<GlobalDataProps>({
  modules:{
    users,
    templates,
    editor,
  },
  plugins:[saveVuexPlugin]
})

export default store