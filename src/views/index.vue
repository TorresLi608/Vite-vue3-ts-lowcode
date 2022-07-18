<script lang="ts" setup>
import UserProfile from '@/components/UserProfile.vue'

</script>

<template>
  <div class="homepage-container">
    <a-layout :style="{background: '#fff'}">
      <a-layout-header class="header">
        <div class="page-title">
          <router-link to="/">灵动一搭</router-link>
        </div>
        <user-profile></user-profile>
      </a-layout-header>
      <a-layout-content class="home-layout">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
    <a-layout-footer>
      tiger608@qq.com 开源
    </a-layout-footer>
  </div>
</template>


<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-title {
  color: #fff;
}
</style>
