// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// 引入 ElementUI 插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 自定义样式
import '@/assets/css/reset.css'
import router from './router'

// 引入 axios
import MyHttpServer from '@/plugins/http.js'

// 引入自定义面包屑组件
import myBread from '@/components/cuscom/myBread.vue'

// 引入 时间格式插件
import moment from 'moment'

Vue.use(ElementUI);
Vue.use(MyHttpServer)

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('dateFormat',(v) => {
  return moment(v).format('YYYY-MM-DD');
})

// 定义全局组件
Vue.component(myBread.name, myBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
