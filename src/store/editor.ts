import { Module } from 'vuex'
import { message } from 'ant-design-vue'
import {ComponentData,EditorProps,GlobalDataProps } from '@/types'
import { v4 as uuidv4 } from 'uuid'


const components:ComponentData[] = [
  {id:uuidv4(),name:"l-text",props:{text:"hello1",fontSize:'20px',actionType:'url',url:'https://www.baidu.com'}},
  {id:uuidv4(),name:"l-text",props:{text:"hello2",fontSize:'15px'}},
  {id:uuidv4(),name:"l-text",props:{text:"hello3",fontSize:'10px'}},
]


const editor:Module<EditorProps,GlobalDataProps> = {
    state:{
      components,
      currentElement:''
    }
}


export default editor