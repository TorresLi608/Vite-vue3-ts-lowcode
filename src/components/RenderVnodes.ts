import { defineComponent } from 'vue'

export default defineComponent({
  props:{
    vNode:{
      type:[Object,String],
      required:true
    }
  },
  render(){
    return this.vNode
  }
})