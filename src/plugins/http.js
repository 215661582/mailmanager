
import axios from 'axios'
import { defaults } from 'autoprefixer'

const MyHttpServer = {}

MyHttpServer.install = (Vue) => {
    
    axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
    // 4. 添加实例方法
    Vue.prototype.$http = axios
}

export default MyHttpServer