<template>
  <div class="create-component-list">
    <l-text v-for="(item,index) in list" :key="index" v-bind="item"></l-text>
  </div>
</template>
<script lang="ts">
import {defineComponent} from 'vue'
import LText from './LText.vue'
export default defineComponent({
  name:'component-list',
  components:{LText,},
  props:{
    list:{
      type:Array,
      default:()=>([])
    },
  },
  setup(props,context){

  }
})
</script>