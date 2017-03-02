<template>
    <div>
        <div class="searchBox">
            <el-form ref="form" :inline="true" :model="searchForm" label-width="80px">
                <el-form-item label="查询类型">
                    <el-select v-model="searchForm.type">
                        <el-option v-for="item in typeList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键词">
                    <el-input v-model="searchForm.keywords" :placeholder="typeList[searchForm.type].label+((searchForm.type==6||searchForm.type==7)?' 不持股请输入 \'-\' ':'')"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="search" @click="getSeniorList">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="warning">高管信息数据量较大，请手动搜索  |  部分高管一人多职，将显示成两条记录</div>
        <div class="list" v-loading.body="loading">
            <el-table
                    :data="seniorList"
                    stripe
                    border
                    style="width: 100%"
            >
                <el-table-column
                        prop="name"
                        label="姓名"
                        min-width="100">
                </el-table-column>
                <el-table-column
                        prop="company"
                        label="所在公司"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="股票代码"
                        min-width="100">
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="职位"
                        show-overflow-tooltip="true"
                        min-width="140">
                </el-table-column>
                <el-table-column
                        prop="education"
                        label="学历"
                        min-width="120">
                </el-table-column>
                <el-table-column
                        prop="birth"
                        label="生日"
                        min-width="160">
                </el-table-column>
                <el-table-column
                        prop="hold_stocks"
                        label="持股数"
                        min-width="100"
                >
                </el-table-column>
                <el-table-column
                        prop="stock_ratio"
                        label="持股比例"
                        min-width="100"
                >
                </el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100"
                >
                    <template scope="scope">
                        <el-button type="text" @click="showInfo(scope.$index)">个人经历</el-button>
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
        <el-dialog :title="dialog.name+' 个人经历'" v-model="dialogVisible" >
            <span>{{dialog.experience}}</span>
        </el-dialog>
    </div>
</template>

<style scoped>
    .el-pagination{
        margin-top:10px;
    }
    .warning{
        font-size:14px;
        margin-top:-10px;
        margin-bottom:10px;
        color:#F7BA2A;
    }
</style>

<script>
    import axios from "axios";
    import router from "../../../routes";

    export default{
        data(){
            return {
                loading:false,
                seniorList:[],
                numOfPage:0,
                searchForm:{
                    keywords:'',
                    type:0
                },
                typeList:[
                    {
                        label:'姓名',
                        value:0
                    },
                    {
                        label:'公司名称',
                        value:1
                    },
                    {
                        label:'职位',
                        value:2
                    },
                    {
                        label:'公司股票代码',
                        value:3
                    },
                    {
                        label:'学历',
                        value:4
                    },
                    {
                        label:'生日',
                        value:5
                    },
                    {
                        label:'持股数',
                        value:6
                    },
                    {
                        label:'持股比例',
                        value:7
                    }
                ],
                dialogVisible:false,
                dialog:{
                    name:'',
                    experience:''
                }
            }
        },
        watch:{
            '$route':'getSeniorList'
        },
        methods:{
            changePage(curr){
                router.push({name:'SeniorInfo',params:{page:curr}});
            },
            getSeniorList(){
                if(!this.searchForm.keywords){
                    return this.$message({
                        type:'warning',
                        message:'关键词不能为空!'
                    })
                }
                this.loading=true;
                let page=this.$route.params.page||1;
                axios.get('/senior/list/'+page+'/'+this.searchForm.type+'/'+this.searchForm.keywords)
                    .then((response) => {
                        let res = response.data;
                        if (res.code == 0) {
                            this.seniorList=res.body.seniorList;
                            this.numOfPage=res.body.numOfSenior;
                        }
                    })
                    .then(()=>{
                        this.loading=false;
                    })
            },
            showInfo(index){
                this.dialogVisible=!this.dialogVisible;
                this.dialog.name=this.seniorList[index].name;
                this.dialog.experience=this.seniorList[index].experience;
            }
        }
    }
</script>