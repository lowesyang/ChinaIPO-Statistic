import Vue from "vue";
import VueRouter from "vue-router";
import {
    App,
    CompanyInfo,
    CompanyGraph,
    SeniorInfo,
    SeniorGraph
} from "./components";

Vue.use(VueRouter);

const routes=[
    {
        path:'/',
        name:'App',
        component:App,
        children:[
            {
                path:'/company/info',
                redirect:'/company/info/1'
            },
            {
                path:'/company/info/:page',
                name:'CompanyInfo',
                component:CompanyInfo,
            },
            {
                path:'/company/graph',
                name:'CompanyGraph',
                component:CompanyGraph
            },
            {
                path:'/senior/info',
                redirect:'/senior/info/1'
            },
            {
                path:'/senior/info/:page',
                name:'SeniorInfo',
                component:SeniorInfo
            },
            {
                path:'/senior/graph',
                name:'SeniorGraph',
                component:SeniorGraph
            }
        ]
    }
];

const router=new VueRouter({
    routes
});

export default router;