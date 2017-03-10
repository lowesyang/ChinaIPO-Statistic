<template>
    <div>
        <div class="header">
            <div id="headParticles"></div>
            <div class="box">
                <div class="logo fl">
                    <div class="main">ChinaIPO Statistic</div>
                    <div class="sub">新三板上市企业数据分析</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .header{
        position:relative;
        z-index:-1;
        width:100%;
        background:#fff;
        height:100px;
        -webkit-box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
        -moz-box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
        box-shadow: 0 1px 5px 0 rgba(0,34,77,.1);
    }
    #headParticles{
        position: absolute;
        left:0;
        top:0;
        width:100%;
        height:100px;
        z-index:0;
    }
    .header .box{
        max-width:1410px;
        margin:0 auto;
    }
    .header .logo{
        position: relative;
        margin:10px 10px;
        z-index:1;
    }
    .header .logo .main{
        font-size:40px;
    }
    .header .logo .sub{
        font-size:24px;
    }
</style>

<script>
    export default{
        data(){
            return {

            }
        },
        mounted(){
            particlesJS.load('headParticles','//src.zhelishi.cn/particles.json');
        }
    }
</script>