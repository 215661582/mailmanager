
import axios from 'axios'
import { defaults } from 'autoprefixer'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {

    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        // console.log('拦截器触发了')
        // console.log(config.url)
        // console.log(config)
        if(config.url !== 'login'){
            // 设置请求头
            const AUTH_TOKEN = localStorage.getItem('token')
            config.headers['Authorization'] = AUTH_TOKEN;
        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default MyHttpServer