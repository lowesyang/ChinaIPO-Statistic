<template>
    <div>
        <el-card class="box-card" v-loading.body="loading">
            <div id="withEdu"></div>
        </el-card>
    </div>
</template>

<style scoped>
    #withEdu{
        display: inline-block;
        width:100%;
        height:400px;
    }
</style>

<script>
    import axios from "axios";
    import {SS,deepClone} from "../../../helpers";
    export default{
        data(){
            return {
                loading:false,
                chart:null,
                initOption:{
                    title:{
                        left:'center',
                        text:'新三板上市公司管理层的学历分布'
                    },
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        top:'bottom',
                        data: ['董事','总裁','经理','总监','监事']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '8%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['其他','大专','本科','硕士','博士']
                    },
                    series: [
                        {
                            name: '其他',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        },
                        {
                            name: '大专',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        },
                        {
                            name: '本科',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        },
                        {
                            name: '硕士',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        },
                        {
                            name: '博士',
                            type: 'bar',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: []
                        }
                    ]
                }
            }
        },
        mounted(){
            this.getEduData();
        },
        methods:{
            getEduData(type,title){
                this.chart=echarts.init(document.getElementById('withEdu'));

                let option_cache=SS.getItem('withEdu');
                if(option_cache){
                    this.chart.setOption(option_cache);
                    return window.addEventListener("resize",this.chart.resize);
                }

                this.loading=true;
                axios.get('/senior/statistic/education')
                    .then((response)=>{
                        let res=response.data;
                        if(!res.code){
                            let result=res.body.result;
                            let option=deepClone(this.initOption);
                            for(let edu in result){
                                if(result.hasOwnProperty(edu)){
                                    let index=option.yAxis.data.indexOf(edu);
                                    for(let i=0;i<option.series.length;i++){
                                        option.series[i].data[index]=result[edu][i];
                                    }
                                }
                            }
                            SS.setItem('withEdu',option);
                            this.chart.setOption(option);
                        }
                    })
                    .then(()=>{
                        this.loading=false;
                        window.addEventListener("resize",this.chart.resize);
                    })
            }
        }
    }
</script>