import { onMounted , onUnmounted } from 'vue'
import hotkeys,{ KeyHandler } from 'hotkeys-js';

const useHotKey = (keys:string,callback:KeyHandler)=>{
  onMounted(()=>{
    hotkeys(keys,callback)
  })
  onUnmounted(()=>{
    hotkeys.unbind(keys,callback)
  })
}

export default useHotKey