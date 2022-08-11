import { createStore,Store } from 'vuex'
import { GlobalDataProps } from '@/types'
import templates from './templates'
import users from './users' 
import editor from './editor'


const store = createStore<GlobalDataProps>({
  modules:{
    users,
    templates,
    editor,
  },
})

export default store