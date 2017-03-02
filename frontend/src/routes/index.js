import Vue from "vue";
import VueRouter from "vue-router";
import {
    App,
    CompanyInfo,
    CompanyGraph,
    SeniorInfo,
    SeniorWithUniv,
    SeniorWithBirth,
    SeniorWithEdu,
    SeniorWithStock,
    CompanyGeography
} from "./components";

Vue.use(VueRouter);

const routes=[
    {
        path:'/',
        name:'App',
        component:App,
        redirect:'/company/info',
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
                path:'/senior/info',
                redirect:'/senior/info/1'
            },
            {
                path:'/senior/info/:page',
                name:'SeniorInfo',
                component:SeniorInfo
            },
            {
                path:'/senior/graph/university',
                name:'SeniorWithUniv',
                component:SeniorWithUniv
            },
            {
                path:'/senior/graph/birth',
                name:'SeniorWithBirth',
                component:SeniorWithBirth
            },
            {
                path:'/senior/graph/education',
                name:'SeniorWithEdu',
                component:SeniorWithEdu
            },
            {
                path:'/senior/graph/stock',
                name:'SeniorWithStock',
                component:SeniorWithStock
            },
            {
                path:'/company/graph/geo',
                name:'CompanyGeography',
                component:CompanyGeography
            }
        ]
    }
];

const router=new VueRouter({
    routes
});

export default router;