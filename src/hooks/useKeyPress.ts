import { onMounted,onUnmounted } from 'vue'

const useKeyPress = (key:string,cb:()=>any)=>{
  const trigger = (e:KeyboardEvent)=>{
    if(e.key === key){
      cb()
    }
  }
  onMounted(()=>{
    document.addEventListener('keydown',trigger)
  })
  onUnmounted(()=>{
    document.removeEventListener('keydown',trigger)
  })
}

export default useKeyPress