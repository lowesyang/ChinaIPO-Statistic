<template>
    <div class="app">
        <Header></Header>
        <div class="container">
            <div class="menuBox">
                <el-menu theme="light" :default-active="$route.name" class="el-menu-vertical-demo" :router="true">
                    <el-submenu index="company">
                        <template slot="title">企业信息</template>
                        <el-menu-item index="CompanyInfo" :route="{name:'CompanyInfo',params:{page:1}}">基本信息查询</el-menu-item>
                        <el-submenu index="CompanyGraph">
                            <template slot="title">统计图表</template>
                            <el-menu-item index="CompanyGeography" :route="{name:'CompanyGeography'}">企业地理位置分布</el-menu-item>
                           </el-submenu>
                    </el-submenu>
                    <el-submenu index="senior">
                        <template slot="title">高管信息</template>
                        <el-menu-item index="SeniorInfo" :route="{name:'SeniorInfo',params:{page:1}}">基本信息查询</el-menu-item>
                        <el-submenu index="SeniorGraph">
                            <template slot="title">统计图表</template>
                            <el-menu-item index="SeniorWithUniv" :route="{name:'SeniorWithUniv'}">985高校的高管分布</el-menu-item>
                            <el-menu-item index="SeniorWithBirth" :route="{name:'SeniorWithBirth'}">高管年龄分布</el-menu-item>
                            <el-menu-item index="SeniorWithEdu" :route="{name:'SeniorWithEdu'}">高管学历分布</el-menu-item>
                            <el-menu-item index="SeniorWithStock" :route="{name:'SeniorWithStock'}">高管股份分布</el-menu-item>
                        </el-submenu>
                    </el-submenu>
                    <!--<el-menu-item index="statistic">其他统计</el-menu-item>-->
                </el-menu>
            </div>
            <div class="main">
                <router-view></router-view>
            </div>
            <div class="cl"></div>
        </div>
        <Footer></Footer>
    </div>
</template>

<style>
    html,body{
        height:100%;
    }
    .menuBox>.el-menu{
        background-color: #fff;
        -webkit-box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
        -moz-box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
        box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
    }
    .el-submenu .el-menu{
        background-color: #f2f2f2;
    }
    .el-card{
        -webkit-box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
        -moz-box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
        box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
        border-color: transparent;
    }
</style>
<style scoped>
    .app{
        height:100vh;
        min-width:960px;
    }
    .container{
        min-height:calc(100% - 120px);
        max-width:1400px;
        margin:0 auto;
        padding:10px;
        margin-bottom:-80px;
    }
    .container>.main{
        padding-bottom:110px;
    }
    .menuBox{
        position: relative;
        z-index:2;
        width:250px;
        float:left;
        padding-bottom:100px;
    }
    .main{
        padding-left:265px;
    }
</style>

<script>
    import Header from "./Header/Header.vue";
    import Footer from "./Footer/Footer.vue";
    export default{
        data(){
            return {}
        },
        components:{
            Header,
            Footer
        }
    }
</script>