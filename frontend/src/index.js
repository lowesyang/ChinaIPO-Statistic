// import Vue from "vue";
import VueHead from "vue-head";
import router from "./routes";
import "./normalize.css";
// import {
//     Form,
//     formItem,
//     Input,
//     Button,
//     Select,
//     Option,
//     Dialog,
//     Menu,
//     Submenu,
//     menuItem,
//     menuItemGroup,
//     Table,
//     tableColumn,
//     Card,
//     Message,
//     Loading,
//     Pagination,
//     Tooltip
// } from "element-ui";
// import ElementUI from "element-ui";
import axios from "axios";

// Vue.use(ElementUI);
Vue.use(VueHead);

axios.defaults.baseURL=DEBUG?'http://localhost:8088/':'http://tx.zhelishi.cn:8088';
axios.defaults.timeout=60000;       //60s timeout
axios.interceptors.response.use((response)=>{
    // 处理错误码-1的请求
    if(response.data.code==-1){
        Vue.prototype.$message({
            type:'error',
            message:response.data.msg
        });
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