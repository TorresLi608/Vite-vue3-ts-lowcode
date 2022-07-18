
<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { message } from 'ant-design-vue';
import { GlobalDataProps } from '@/types'
const router = useRouter();
const store = useStore<GlobalDataProps>()
const user = computed(()=>{
  return store.state.users
})
const login = ()=>{
  store.commit('login')
  message.success('登录成功')
}
const logout = ()=>{
  store.commit('logout')
  message.success('退出成功')
  setTimeout(()=>{
    router.push('/')
  },1000)
}
</script>

<template>
  <div to="/login" v-if="!user.isLogin" @click="login">
    <a-button 
      type="primary"  
      class="user-profile-component"
    >
      登录
    </a-button>
  </div>
  <div v-else>
    <a-dropdown-button  class="user-profile-component">
      <router-link to="/setting">{{user.userName}}</router-link>
      <template v-slot:overlay>
        <a-menu class="user-profile-dropdown">
          <!-- <a-menu-item key="0" @click="createDesign">创建作品</a-menu-item> -->
          <a-menu-item key="1"><router-link to="/works" >我的作品</router-link></a-menu-item>
          <a-menu-item key="2" @click="logout">登出</a-menu-item>
        </a-menu>
      </template>
    </a-dropdown-button>
  </div>
</template>

<style>
.user-profile-dropdown {
  border-radius: 2px !important;
}
.user-operation > * {
  margin-left: 30px !important;
}
</style>
