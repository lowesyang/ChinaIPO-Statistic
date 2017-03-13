<template>
    <div>
        <el-card class="box-card" v-loading.body="registerLoading">
            <div class="geo" id="registerGeo"></div>
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
                        trigger: 'item'
                    },
                    toolbox:{
                        right:'20',
                        feature:{
                            saveAsImage: {
                                pixelRatio:5
                            }
                        },
                        iconStyle: {
                            normal: {
                                borderColor: '#fff'
                            },
                            emphasis: {
                                borderColor: '#b1e4ff'
                            }
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
                        left:'10',
                        right:'35%',
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
                    grid:{
                        right:40,
                        top:100,
                        bottom:40,
                        width:'30%'
                    },
                    xAxis: {
                        type: 'value',
                        scale: true,
                        position: 'top',
                        boundaryGap: false,
                        splitLine: {show: false},
                        axisLine: {show: false},
                        axisTick: {show: false},
                        axisLabel: {margin: 2, textStyle: {color: '#aaa'}},
                    },
                    yAxis: {
                        type: 'category',
                        name: 'TOP 10',
                        nameGap: 16,
                        axisLine: {show: false, lineStyle: {color: '#ddd'}},
                        axisTick: {show: false, lineStyle: {color: '#ddd'}},
                        axisLabel: {interval: 0, textStyle: {color: '#ddd'}},
                        data: []
                    },
                    series : [
                        {
//                            name: '企业数量',
                            type: 'scatter',
                            coordinateSystem: 'geo',
//                            data: convertData(data),
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
//                            symbolSize: function (val) {
//                                return Math.sqrt(val[2]);
//                            },
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
                        },
                        {
                            id:'bar',
                            zlevel:2,
                            type:'bar',
                            symbol:'none',
                            itemStyle:{
                                normal:{
                                    color:'#ddb926'
                                }
                            },
                            data:[]
                        }
                    ]
                }
            }
        },
        mounted(){
            this['chartregister']=echarts.init(document.getElementById('registerGeo'));
            this['chartoffice']=echarts.init(document.getElementById('officeGeo'));
            this.getGeoData('register','注册');
            this.getGeoData('office','办公');
        },
        methods:{
            getGeoData(type,title){
                this[type+'Loading']=true;

                //本地拿缓存
                let option_cache=SS.getItem(type+'Geo');
                if(option_cache){
                    option_cache.tooltip.formatter=(params)=>{
                        let res=params.name+'<br/>';
                        let name=params.componentSubType=='bar'?params.name:params.seriesName;
                        res+=name+'：'+ (Array.isArray(params.value)?params.value[2]:params.value);
                        return res;
                    };
                    option_cache.series[0].symbolSize=option_cache.series[1].symbolSize=(val)=>{
                        return Math.sqrt(val[2]);
                    }
                    // 防止setOption时主线程卡死
                    setTimeout(()=>{
                        this['chart'+type].setOption(option_cache);
                        this[type+'Loading']=false;
                    },0)
                    return window.addEventListener('resize',this['chart'+type].resize)
                }

                axios.get('/company/geo/'+type)
                    .then((response)=>{
                    let res=response.data;
                    if(!res.code){
                        let cityData=res.body.result;
                        let option=deepClone(this.option);

                        //设置图表的option
                        option.title.text='新三板企业'+title+'地址分布';
                        option.legend.data=[title+'企业数量'];
                        option.toolbox.feature.saveAsImage.name=option.title.text;
                        option.series[0].data=this.convertData(cityData);
                        option.series[0].name=option.series[1].name=title+'企业数量';
                        option.series[1].data=this.convertData(cityData.sort(function (a, b) {
                                return b.value - a.value;
                            }).slice(0, 6));

                        //TOP10 排行榜
                        let sortedCityData=cityData.sort((a,b)=>b.value-a.value).slice(0,10);
                        option.yAxis.data=sortedCityData.map(item=>item.name).reverse();
                        option.series[2].data=sortedCityData.map(item=>{
                            return {
                                name:item.name,
                                value:item.value
                            }
                        }).reverse();

                        SS.setItem(type+'Geo',option);

                        //修改值为回调函数的配置项 (无法json化函数)
                        option.tooltip.formatter=(params)=>{
                            let res=params.name+'<br/>';
                            let name=params.componentSubType=='bar'?params.name:params.seriesName;
                            res+=name+'：'+ (Array.isArray(params.value)?params.value[2]:params.value);
                            return res;
                        };
                        option.series[0].symbolSize=option.series[1].symbolSize=(val)=>{
                            return Math.sqrt(val[2]);
                        }

                        this['chart'+type].setOption(option);
                    }
                })
                .then(()=>{
                    this[type+'Loading']=false;
                    window.addEventListener("resize",this['chart'+type].resize);
                })
                .catch((err)=>{
                        this.loading=false;
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
        },
        head:{
            title(){
                return {
                    inner:'企业地址分布'
                }
            }
        }
    }
</script>