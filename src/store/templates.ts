import { Module } from 'vuex'
import { TemplateProps,TemplatesProps,GlobalDataProps } from '@/types'

const templateData:TemplateProps[] = [
  {id:1,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈"},
  {id:2,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈"},
  {id:3,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈"},
  {id:4,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈"},
  {id:5,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈"},
  {id:6,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈"},
]

const templates:Module<TemplatesProps,GlobalDataProps> = {
  state:{
    data:templateData
  },
  getters:{
    getTemplateById:(state,getters,rootState)=>(id:number)=>{
        return state.data.find(item=>item.id===id)
    }
  }
}


export default templates