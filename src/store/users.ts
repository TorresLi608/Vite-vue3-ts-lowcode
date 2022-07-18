import { Module } from 'vuex'
import { UserSProps,GlobalDataProps } from '@/types'

const users:Module<UserSProps,GlobalDataProps> = {
  state:{
    userName:'',
    isLogin:false,
  },
  mutations:{
    login(state){
      state.userName = 'Torres'
      state.isLogin = true
    },
    logout(state){
      state.userName = ''
      state.isLogin = false
    }
  }
}

export default users