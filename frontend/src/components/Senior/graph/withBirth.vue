<template>
    <div>
        <el-card class="box-card" v-loading.body="loading">
            <div id="withBirth"></div>
            <el-select
                    v-model="seniorTitle"
                    @change="updateTitle"
            >
                <el-option
                        v-for="item in titleList"
                        :label="item.label"
                        :value="item.value"
                ></el-option>
            </el-select>
        </el-card>
    </div>
</template>

<style scoped>
    #withBirth{
        display: inline-block;
        width:80%;
        height:400px;
    }
    .el-select{
        width:20%;
        float:right;
        margin-top:0px;
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
                seniorTitle:'All',
                titleList:[
                    {
                        value:'All',
                        label:'管理层'
                    },
                    {
                        value:'Director',
                        label:'董事'
                    },
                    {
                        value:'President',
                        label:'正副总裁'
                    },
                    {
                        value:'Manager',
                        label:'正副总经理'
                    },
                    {
                        value:'Zongjian',
                        label:'总监'
                    },
                    {
                        value:'Supervisor',
                        label:'监事'
                    }
                ],
                initOption:{
                    title: {
//                        text: '新三板上市公司管理层的年龄分布',
                        left: 'center',
                        top: 0,
                        textStyle: {
                            color: '#475669',
                            fontSize:16
                        }
                    },

                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            saveAsImage: {
                                pixelRatio:5
                            }
                        },
                        right:'20'
                    },
                    visualMap: {
                        show: false,
//                        min: 2000,
//                        max: 120000,
                        inRange: {
                            colorLightness: [0.3, 1]
                        }
                    },
                    series: {
                        name: '管理层人数',
                        type: 'pie',
                        radius: '80%',
                        center: ['50%', '55%'],
//                            data: [
//                                {value: 335, name: '直接访问'},
//                                {value: 310, name: '邮件营销'},
//                                {value: 274, name: '联盟广告'},
//                                {value: 235, name: '视频广告'},
//                                {value: 400, name: '搜索引擎'}
//                            ].sort(function (a, b) {
//                                return a.value - b.value
//                            }),
                        data:[],
                        label: {
                            normal: {
                                textStyle: {
                                    color: '#475669',
                                    fontSize:14
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: '#475669'
                                },
                                smooth: 0.5,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color:'#c23531',
                                shadowBlur: 20,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },

                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                }
            }
        },
        mounted(){
            this.chart=echarts.init(document.getElementById('withBirth'));
            this.updateTitle(this.seniorTitle);
        },
        methods: {
            // type 获取的title类型
            // 图表标题
            // min 渐变色最小数值
            // max 渐变色最大数值
            getBirthData(type,title,min,max){
                let option_cache = SS.getItem('withBirthFor'+type);
                if (option_cache) {
                    this.chart.setOption(option_cache);
                    return window.addEventListener("resize",this.chart.resize);
                }
                this.loading = true;
                axios.get('/senior/statistic/birth/'+type)
                    .then((response) => {
                        let res = response.data;
                        if (!res.code) {
                            let result = res.body.result;
                            let option=deepClone(this.initOption);
                            option.title.text='新三板上市公司[ '+title+' ]的年龄分布';
                            option.visualMap.min=min;
                            option.visualMap.max=max;
                            for(let key in result){
                                if(result.hasOwnProperty(key)){
                                    option.series.data.push({
                                        name:key,
                                        value:result[key]
                                    })
                                }
                            }
                            option.series.data.sort((a,b)=>{
                                return a.value-b.value
                            });
                            SS.setItem('withBirthFor'+type, option);
                            this.chart.setOption(option)
                        }
                    })
                    .then(() => {
                        this.loading = false;
                        window.addEventListener("resize",this.chart.resize);
                    })
                    .catch((err)=>{
                        this.loading=false;
                    })
            },
            updateTitle(type){
                if(type=='Director'){
                    this.getBirthData('Director','董事',500,40000);
                }
                else if(type=='President'){
                    this.getBirthData('President','正副总裁',10,15000);
                }
                else if(type=='Manager'){
                    this.getBirthData('Manager','正副总经理',20,20000);
                }
                else if(type=='Zongjian'){
                    this.getBirthData('Zongjian','总监',10,8000);
                }
                else if(type=='Supervisor'){
                    this.getBirthData('Supervisor','监事',500,30000);
                }
                else{
                    this.getBirthData('All','管理层',2000,80000);
                }
            }
        },
        head:{
            title(){
                return {
                    inner:'高管年龄分布'
                }
            }
        }
    }
</script>