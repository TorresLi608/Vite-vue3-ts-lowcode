import { Module } from 'vuex'
import { TemplateProps,TemplatesProps,GlobalDataProps } from '@/types'

const templateData:TemplateProps[] = [
  {id:1,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:true},
  {id:2,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:false,isNew:true},
  {id:3,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:false},
  {id:4,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:false},
  {id:5,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:false,isNew:true},
  {id:6,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:true},
  {id:7,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:false},
  {id:8,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:false,isNew:true},
  {id:9,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:true},
  {id:10,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:false,isNew:true},
  {id:11,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:false},
  {id:12,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:false},
  {id:13,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:true,isNew:true},
  {id:14,coverImg:'http://static-dev.imooc-lego.com/upload-files/screenshot-083816.png',author:"Torres",title:"搭建一个海报",desc:"哈哈哈哈哈哈哈哈",isHot:false,isNew:true},
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