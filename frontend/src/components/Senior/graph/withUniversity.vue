<template>
    <div>
        <el-card class="box-card" v-loading.body="loading">
            <div class="title">985高校中校友在新三板上市公司管理层的人数统计</div>
            <div id="withUniversity"></div>
        </el-card>
    </div>
</template>

<style scoped>
    #withUniversity{
        height:400px;
    }
    .title{
        text-align: center;
        font-size:16px;
        margin-bottom:10px;
    }
</style>

<script>
    import axios from "axios";
    import {SS} from "../../../helpers";

    export default{
        data(){
            return {
                loading:false,
                chart:null,
                university:["清华大学","北京大学","浙江大学","上海交通大学","复旦大学","武汉大学","哈尔滨工业大学","中国科学技术大学","中国人民大学","南京大学","中山大学"],
            }
        },
        mounted(){
            this.chart=echarts.init(document.getElementById('withUniversity'));
            window.addEventListener("resize",this.chart.resize);
            this.getUniversityData();
        },
        methods:{
            getUniversityData(){
                let option_cache=SS.getItem('withUniversity');
                if(option_cache){
                    return this.chart.setOption(option_cache);
                }
                this.loading=true;
                axios.get('/senior/statistic/university')
                    .then((response)=>{
                        let res=response.data;
                        if(!res.code){
                            let result=res.body.result;
                            let _self=this;

                            let option={
                                tooltip : {
                                    trigger: 'axis',
                                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                },
                                toolbox: {
                                    show: true,
                                    feature: {
                                        magicType: {type: ['line', 'bar']},
                                        saveAsImage: {}
                                    },
                                },
                                legend: {
                                    data:['董事','正副总裁','正副总经理','总监','监事']
                                },
                                xAxis: {
                                    type:'category',
                                    data: _self.university,
                                    axisLabel:{
                                        interval:0,
                                        rotate:-30
                                    }
                                },
                                yAxis: {
                                    type:'value'
                                },
                                series: [
                                    {
                                        name: '董事',
                                        type: 'bar',
                                        data: []
                                    },
                                    {
                                        name:'正副总裁',
                                        type:'bar',
                                        data: []
                                    },
                                    {
                                        name:'正副总经理',
                                        type:'bar',
                                        data: []
                                    },
                                    {
                                        name:'总监',
                                        type:'bar',
                                        data: []
                                    },
                                    {
                                        name:'监事',
                                        type:'bar',
                                        data: []
                                    }
                                ]
                            }
                            for(let univ in result){
                                if(result.hasOwnProperty(univ)){
                                    let index=this.university.indexOf(univ);
                                    for(let i=0;i<option.series.length;i++) {
                                        option.series[i].data[index]=result[univ][i];
                                    }
                                }
                            }
                            SS.setItem('withUniversity',option);
                            this.chart.setOption(option);
                        }
                    })
                    .then(()=>{
                        this.loading=false;
                    })
                    .catch((err)=>{
                        this.loading=false;
                    })
            }
        },
        head:{
            title(){
                return {
                    inner:'985高校高管分布'
                }
            }
        }
    }
</script>