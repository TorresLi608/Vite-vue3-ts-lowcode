import { createRouter, createWebHistory } from 'vue-router'
import index from '@/views/index.vue'
import Home from '@/views/Home.vue'
import TemplateDetail from '@/views/TemplateDetail.vue'

const routes = [
  {
    path: '/',
    name: 'index',
    component: index,
    children: [
      {
        path: '',
        name: 'home',
        component: Home,
        meta: { title: '欢迎来到慕课乐高' },
      },
      {
        path: 'template/:id',
        name: 'template',
        component: TemplateDetail,
        meta: { title: '模版详情' },
      },
    ],
  },
  {
    path: '/editor/:id',
    name: 'editor',
    component: () => import('@/views/editor/Editor.vue'),
  },
  {
    path:'/editor/preview/:id',
    name:"preview",
    meta:{ title:'作品预览' },
    component:() => import('@/views/editor/PreviewEditorPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

export default router
