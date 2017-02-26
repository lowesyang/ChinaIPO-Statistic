<template>
    <div class="app">
        <Header></Header>
        <div class="container">
            <div class="menuBox">
                <el-menu theme="light" :default-active="$route.name" class="el-menu-vertical-demo" :router="true">
                    <el-submenu index="company">
                        <template slot="title">公司信息</template>
                        <el-menu-item index="CompanyInfo" :route="{name:'CompanyInfo',params:{page:1}}">基本信息查询</el-menu-item>
                        <el-menu-item index="CompanyGraph" :route="{name:'CompanyGraph'}">统计图表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="senior">
                        <template slot="title">高管信息</template>
                        <el-menu-item index="SeniorInfo" :route="{name:'SeniorInfo',params:{page:1}}">基本信息查询</el-menu-item>
                        <el-menu-item index="SeniorGraph" :route="{name:'SeniorGraph'}">统计图表</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="statistic">其他统计</el-menu-item>
                </el-menu>
            </div>
            <div class="main">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style>
    html,body{
        height:100%;
    }
    .el-card{
        -webkit-box-shadow: 0 0px 0px 0 rgba(0,34,77,.1);
        -moz-box-shadow: 0 0px 0px 0 rgba(0,34,77,.1);
        box-shadow: 0 0px 0px 0 rgba(0,34,77,.1);
    }
</style>
<style scoped>
    .app{
        height:100vh;
    }
    .container{
        min-width:960px;
        max-width:1400px;
        margin:0 auto;
        padding:10px;
    }

    .menuBox{
        width:250px;
        float:left;
        text-align: center;
    }
    .main{
        padding-left:265px;
    }
</style>

<script>
    import Header from "./Header/Header.vue";
    export default{
        data(){
            return {}
        },
        components:{
            Header
        }
    }
</script>