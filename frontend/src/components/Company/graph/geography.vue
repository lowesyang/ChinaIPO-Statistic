<template>
    <div>
        <el-card class="box-card" v-loading.body="registerLoading">
            <div class="geo" id="registeredGeo"></div>
        </el-card>
        <el-card class="box-card" v-loading.body="officeLoading">
            <div class="geo" id="officeGeo"></div>
        </el-card>
    </div>
</template>

<style scoped>
    .el-card{
        background-color: #404a59;
        margin-bottom:10px;
    }
    .geo{
        height:460px;
    }
</style>

<script>
    import axios from "axios";
    import {SS,geoCoordMap,deepClone} from "../../../helpers";

    export default{
        data(){
            return {
                registerLoading:false,
                officeLoading:false,
                chartregister:null,
                chartoffice:null,
                option:{
                    backgroundColor: '#404a59',
                    title: {
                        subtext: '仅统计190个主要城市',
                        left: 'center',
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter(params){
                            let res=params.name+'<br/>';
                            res+=params.seriesName+'：'+params.value[2];
                            return res;
                        }
                    },
                    legend: {
                        orient: 'vertical',
                        y: 'bottom',
                        x:'right',
//                        data:['企业数量'],
                        textStyle: {
                            color: '#fff'
                        }
                    },
                    geo: {
                        map: 'china',
                        label: {
                            emphasis: {
                                show: false
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#323c48',
                                borderColor: '#111'
                            },
                            emphasis: {
                                areaColor: '#2a333d'
                            }
                        }
                    },
                    series : [
                        {
//                            name: '企业数量',
                            type: 'scatter',
                            coordinateSystem: 'geo',
//                            data: convertData(data),
                            symbolSize: function (val) {
                                return Math.sqrt(val[2]);
                            },
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: false
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#ddb926'
                                }
                            }
                        },
                        {
//                            name: '企业数量',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
//                            data: convertData(data.sort(function (a, b) {
//                                return b.value - a.value;
//                            }).slice(0, 6)),
                            symbolSize: function (val) {
                                return Math.sqrt(val[2]);
                            },
                            showEffectOn: 'render',
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            hoverAnimation: true,
                            label: {
                                normal: {
                                    formatter: '{b}',
                                    position: 'right',
                                    show: true
                                }
                            },
                            itemStyle: {
                                normal: {
                                    color: '#f4e925',
                                    shadowBlur: 10,
                                    shadowColor: '#333'
                                }
                            },
                            zlevel: 1
                        }
                    ]
                }
            }
        },
        mounted(){
            this.chartregister=echarts.init(document.getElementById('registeredGeo'));
            this.chartoffice=echarts.init(document.getElementById('officeGeo'));
            this.getGeoData('register','注册');
            this.getGeoData('office','办公');
        },
        methods:{
            getGeoData(type,title){
                // 本地拿缓存
                let option_cache=SS.getItem(type+'Geo');
                if(option_cache){
                    this.chartRegister.setOption(option_cache);
                    return window.addEventListener('resize',this['chart'+type].resize)
                }

                this[type+'Loading']=true;
                axios.get('/company/geo/'+type)
                    .then((response)=>{
                    let res=response.data;
                    if(!res.code){
                        let cityData=res.body.result;
                        let option=deepClone(this.option);
                        option.title.text='新三板企业'+title+'地址分布';
                        option.legend.data=[title+'企业数量'];
                        option.series[0].data=this.convertData(cityData);
                        option.series[0].name=option.series[1].name=title+'企业数量';
                        option.series[1].data=this.convertData(cityData.sort(function (a, b) {
                                return b.value - a.value;
                            }).slice(0, 6));
                        SS.setItem(type+'Geo',option);
                        this['chart'+type].setOption(option);
                    }
                })
                .then(()=>{
                    this[type+'Loading']=false;
                    window.addEventListener("resize",this['chart'+type].resize);
                })
            },
            convertData(data) {
                let res = [];
                for (var i = 0; i < data.length; i++) {
                    let geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            }
    }
    }
</script>