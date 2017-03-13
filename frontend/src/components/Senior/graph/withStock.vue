<template>
    <div>
        <el-card class="box-card" v-loading.body="loading">
            <div id="withStock"></div>
        </el-card>
    </div>
</template>

<style scoped>
    #withStock{
        height:400px;
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
                option:{
                    title:{
                        left:'center',
                        text:'新三板上市公司管理层[平均持股比例]情况',
                        subtext:'剔除不持股权的高管',
                        subtextStyle:{
                            fontSize:14
                        }
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
                    legend:{
                        left:'5%',
                        top:'8%',
                        data:['平均持股比例(%)']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        top:'18%',
                        containLabel: true
                    },
                    xAxis : {
                        type : 'category',
                        data : ['董事', '正副总裁', '正副总经理', '总监', '监事'],
                        axisTick: {
                            alignWithLabel: true
                        },
                        nameTextStyle:{
                            fontSize:14
                        }
                    }
                    ,
                    yAxis : [
                        {
                            type : 'value',
                            position:'top'
                        }
                    ],
                    series : [
                        {
                            name:'平均持股比例(%)',
                            type:'bar',
                            barWidth: '40%',
                            data:[],
                            label:{
                                normal:{
                                    show:true,
                                    position:'top',
                                    formatter:'{c}%',
                                    textStyle:{
                                        fontSize:14
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        mounted(){
            this.chart=echarts.init(document.getElementById('withStock'));
            this.getStockData();
        },
        methods:{
            getStockData(){
                let option_cache=SS.getItem('withStock');
                if(option_cache){
                    this.chart.setOption(option_cache);
                    return window.addEventListener("resize",this.chart.resize);
                }

                this.loading=true;
                axios.get('/senior/statistic/stock')
                    .then((response)=>{
                        let res=response.data;
                        if(!res.code){
                            res.body.data.forEach((item)=>{
                                this.option.series[0].data.push(item);
                            });
                            SS.setItem('withStock',this.option);
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
                    inner:'高管股份分布'
                }
            }
        }
    }
</script>