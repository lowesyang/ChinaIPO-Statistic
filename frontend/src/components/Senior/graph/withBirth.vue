<template>
    <div>
        <el-card class="box-card" v-loading.body="loading">
            <div class="withBirth" id="withBirthForAll"></div>
            <div class="withBirth" id="withBirthForDirector"></div>
            <div class="withBirth" id="withBirthForPresident"></div>
            <div class="withBirth" id="withBirthForManager"></div>
            <div class="withBirth" id="withBirthForZongjian"></div>
            <div class="withBirth" id="withBirthForSupervisor"></div>
        </el-card>
    </div>
</template>

<style scoped>
    .el-card .withBirth{
        display: inline-block;
        width:32.8%;
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
                chartForAll:null,
                chartForDirector:null,
                chartForPresident:null,
                chartForManager:null,
                chartForZongjian:null,
                chartForSupervisor:null,
                birth:['50后','60后','70后','80后','90后'],
                initOption:{
                    title: {
//                        text: '新三板上市公司管理层的年龄分布',
                        left: 'center',
                        top: 20,
                        textStyle: {
                            color: '#475669',
                            fontSize:16
                        }
                    },

                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
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
                        radius: '55%',
                        center: ['50%', '50%'],
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
            this.getBirthData('All','管理层','#c23531',2000,120000);
            this.getBirthData('Director','董事','rgb(42,128,185)',500,40000);
            this.getBirthData('President','正副总裁','rgb(243,156,17)',10,12000);
            this.getBirthData('Manager','正副总经理','rgb(45,62,80)',20,20000);
            this.getBirthData('Zongjian','总监','rgb(210,84,0)',10,6000);
            this.getBirthData('Supervisor','监事','rgb(143,68,173)',500,30000);
        },
        methods: {
            // type 获取的title类型
            // 图表标题
            // color 饼图的颜色
            // min 渐变色最小数值
            // max 渐变色最大数值
            getBirthData(type,title,color,min,max){
                this['chartFor'+type]=echarts.init(document.getElementById('withBirthFor'+type));

                let option_cache = SS.getItem('withBirthFor'+type);
                if (option_cache) {
                    this['chartFor'+type].setOption(option_cache);
                    return window.addEventListener("resize",this['chartFor'+type].resize);
                }
                this.loading = true;
                axios.get('/senior/statistic/birth/'+type)
                    .then((response) => {
                        let res = response.data;
                        if (!res.code) {
                            let result = res.body.result;
                            let option=deepClone(this.initOption);
                            option.title.text='新三板上市公司['+title+']的年龄分布';
                            option.series.itemStyle.normal.color=color;
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
                            this['chartFor'+type].setOption(option)
                        }
                    })
                    .then(() => {
                        this.loading = false;
                        window.addEventListener("resize",this['chartFor'+type].resize);
                    })
                }
            }
        }
</script>