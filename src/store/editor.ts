import { Module } from 'vuex'
import { message } from 'ant-design-vue'
import {ComponentData,EditorProps,GlobalDataProps } from '@/types'
import { TextComponentProps } from '@/defaultProps'
import { v4 as uuidv4 } from 'uuid'


const components:ComponentData[] = [
  {id:uuidv4(),name:"l-text",props:{text:"hello1",fontSize:'20',actionType:'url',url:'',lineHeight:1,color:"red"}},
  {id:uuidv4(),name:"l-text",props:{text:"hello2",fontSize:'15'}},
  {id:uuidv4(),name:"l-text",props:{text:"hello3",fontSize:'10'}},
]


const editor:Module<EditorProps,GlobalDataProps> = {
    state:{
      components,
      currentElement:''
    },
    getters:{
      getCurrentElement(state){
        return state.components.find(item=>state.currentElement === item.id)
      }
    },
    mutations:{
      addComponent(state,props:Partial<TextComponentProps>){
        const newComponent:ComponentData = {
          id:uuidv4(),
          name:'l-text',
          props
        }
        state.components.push(newComponent)
      },
      setActive(state,id:string){
        console.log(id,'ididid')
        state.currentElement = id
      }
    }
}


export default editor