import { createApp } from "vue";
import Antd from 'ant-design-vue';
import App from "./App.vue";
import router from '@/router/index'
import store from '@/store/index'
import 'ant-design-vue/dist/antd.css';
import 'cropperjs/dist/cropper.css'

console.log(import.meta.env,'meta')

const app = createApp(App);
app.use(Antd).use(router).use(store)
app.mount('#app')

