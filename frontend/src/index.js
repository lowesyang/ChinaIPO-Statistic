import Vue from "vue";
import VueHead from "vue-head";
import router from "./routes";
import 'element-ui/lib/theme-default/index.css';
import ElementUI from "element-ui";
import axios from "axios";

Vue.use(ElementUI);
Vue.use(VueHead);

axios.defaults.baseURL='http://localhost:8088/';
axios.defaults.timeout=60000;       //60s timeout
axios.interceptors.response.use((response)=>{
    // 处理错误码-1的请求
    if(response.data.code==-1){
        return Promise.reject(response.data.msg)
    }
    return response;
},(err)=>{
    Vue.prototype.$message({
        type:'error',
        message:err.toString()
    });
    return Promise.reject(err)
});

const app=new Vue({
    router
}).$mount('#App');