<template>
    <div>
        <el-card class="box-card" v-loading.body="loading">
            <div id="withEdu"></div>
        </el-card>
    </div>
</template>

<style scoped>
    #withEdu{
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
                option:{
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
                    toolbox: {
                        show: true,
                        feature: {
                            magicType: {type: ['line', 'bar']},
                            saveAsImage: {
                                pixelRatio:5
                            }
                        },
                        right:'20'
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
                            name: '董事',
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
                            name: '总裁',
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
                            name: '经理',
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
                            name: '总监',
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
                            name: '监事',
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
            this.chart=echarts.init(document.getElementById('withEdu'));
            this.getEduData();
        },
        methods:{
            getEduData(){
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
                            for(let edu in result){
                                if(result.hasOwnProperty(edu)){
                                    let index=this.option.yAxis.data.indexOf(edu);
                                    for(let i=0;i<this.option.series.length;i++){
                                        this.option.series[i].data[index]=result[edu][i];
                                    }
                                }
                            }
                            SS.setItem('withEdu',this.option);
                            this.chart.setOption(this.option);
                        }
                    })
                    .then(()=>{
                        this.loading=false;
                        window.addEventListener("resize",this.chart.resize);
                    })
                    .catch((err)=>{
                        this.loading=false;
                    })
            }
        },
        head:{
            title(){
                return {
                    inner:'高管学历分布'
                }
            }
        }
    }
</script>