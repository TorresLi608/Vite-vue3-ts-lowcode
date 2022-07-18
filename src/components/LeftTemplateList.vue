<template>
  <div class="create-component-list">
    <div v-for="(item,index) in list" :key="index" class="component-item" @click="onItemClick(item)">
        <l-text :key="index" v-bind="item"></l-text>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { TextComponentProps } from '@/defaultProps'
import LText from './LText.vue'
export default defineComponent({
  name:'component-list',
  components:{LText,},
  emits:['on-item-click'],
  props:{
    list:{
      type:Array,
      default:()=>([])
    },
  },
  setup(props,context){
    const onItemClick = (item:Partial<TextComponentProps>)=>{
      console.log(item,'item')
      context.emit('on-item-click',item)
    }
    return {
      onItemClick,
    }
  }
})
</script>

<style>
.component-item {
  width: 100px;
  margin: 0 auto;
  margin-bottom: 15px;
}
.component-item > * {
  position: static !important;
}
</style>