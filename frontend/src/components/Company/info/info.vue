<template>
    <div>
        <el-card class="box-card">
            <div class="searchBox">
                <el-form ref="form" :inline="true" :model="searchForm" label-width="80px">
                    <el-form-item label="查询类型">
                        <el-select v-model="searchForm.type">
                            <el-option v-for="item in typeList" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关键词">
                        <el-input v-model="searchForm.keywords" :placeholder="typeList[searchForm.type].label"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="search" @click="getCompanyList">搜索</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="list" v-loading.body="loading">
                <el-table
                        :data="companyList"
                        stripe
                        border
                        style="width: 100%"
                >
                    <el-table-column
                            prop="code"
                            label="股票代码"
                            width="95">
                    </el-table-column>
                    <el-table-column
                            prop="company"
                            label="公司名称"
                            min-width="110">
                    </el-table-column>
                    <el-table-column
                            prop="owner"
                            label="实际控制人"
                            show-overflow-tooltip="true"
                            min-width="140">
                    </el-table-column>
                    <el-table-column
                            prop="legal_representative"
                            label="法人代表"
                            min-width="90">
                    </el-table-column>
                    <el-table-column
                            prop="registered_capital"
                            label="注册资本(万元)"
                            min-width="110">
                    </el-table-column>
                    <el-table-column
                            prop="sponsored_broker"
                            label="主办券商"
                            min-width="120"
                            show-overflow-tooltip="true"
                            >
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="180"
                    >
                        <template scope="scope">
                            <el-button size="small" @click="showProfile(scope.$index)">公司简介</el-button>
                            <a :href="'http://www.chinaipo.com/stock/'+companyList[scope.$index].code+'/profile.html'" target="_blank">查看详情</a>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        small
                        layout="prev,pager,next,jumper,total"
                        :page-size="12"
                        :total="numOfPage"
                        :current-page="parseInt(this.$route.params.page)||1"
                        @current-change="changePage"
                ></el-pagination>
            </div>
        </el-card>
        <el-dialog :title="dialog.company+' 简介'" v-model="dialogVisible" >
            <span>{{dialog.company+dialog.profile}}</span>
        </el-dialog>
    </div>
</template>

<style scoped>
    .el-pagination{
        margin-top:10px;
    }
</style>
<style>
    .el-dialog__body {
        margin-top:-10px;
    }
</style>

<script>
    import axios from "axios";
    import {LS} from "../../../helpers";
    import router from "../../../routes";

    export default{
        data(){
            return {
                loading:true,
                companyList:[],
                typeList:[
                    {
                        label:'股票代码',
                        value:0
                    },
                    {
                        label:'公司名称',
                        value:1
                    },
                    {
                        label:'法定代表人',
                        value:2
                    },
                    {
                        label:'主办券商',
                        value:3
                    }
                ],
                searchForm:{
                    keywords:'',
                    type:0
                },
                numOfPage:0,
                dialogVisible:false,
                dialog:{
                    company:'',
                    profile:''
                }
            }
        },
        created(){
            this.getCompanyList();
        },
        watch:{
            '$route':'getCompanyList'
        },
        methods:{
            changePage(curr){
                router.push({name:'CompanyInfo',params:{page:curr}});
            },
            getCompanyList(){
                this.loading=true;
                let page=this.$route.params.page||1;
                axios.get('/company/list/'+page+'/'+this.searchForm.type+'/'+(this.searchForm.keywords||'null'))
                    .then((response) => {
                        let res = response.data;
                        if (res.code == 0) {
                            this.companyList=res.body.companyList;
                            this.numOfPage=res.body.numOfCompany;
                        }
                    })
                    .then(()=>{
                        this.loading=false;
                    })
            },
            showProfile(index){
                this.dialogVisible=!this.dialogVisible;
                this.dialog.company=this.companyList[index].company;
                this.dialog.profile=this.companyList[index].profile;
            }
        }
    }
</script>