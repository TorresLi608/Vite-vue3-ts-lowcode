import { Module } from 'vuex'
import { message } from 'ant-design-vue'
import {ComponentData,EditorProps,GlobalDataProps } from '@/types'
import { TextComponentProps } from '@/defaultProps'
import { v4 as uuidv4 } from 'uuid'


const components:ComponentData[] = [
  {id:uuidv4(),name:"l-text",props:{text:"hello1",fontSize:'20',actionType:'url',url:'',color:"red",textAlign:'left',fontFamily:''}},
  {id:uuidv4(),name:"l-text",props:{text:"hello2",fontSize:'15',textAlign:'right',fontFamily:'',lineHeight:'1'}},
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
        state.currentElement = id
      },
      updateComponent(state,{key,value}){
        const updateComponent = state.components.find(item=>state.currentElement === item.id)
        if(updateComponent){
          updateComponent.props[key] = value
        }
      }
    }
}


export default editor