<template>
    <div>
        <div class="footer">
            <div class="main">
                <div class="content">
                    <div class="title">ChinaIPO Statistic v1.0</div>
                    <div class="subTitle">本项目数据来源自 <a href="http://www.chinaipo.com" target="_blank">新三板在线</a> 仅供学习参考，禁止任何商业用途</div>
                </div>
                <div class="contact fr">
                    <div class="github">
                        <a href="https://github.com/yyh1102/ChinaIPO-Statistic" target="_blank">
                            <i class="iconfont icon-github-copy"></i>
                        </a>
                    </div>
                    <div class="feedback">
                        <a href="https://github.com/yyh1102/ChinaIPO-Statistic/issues" target="_blank"> 反馈建议</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .footer{
        position:relative;
        height:80px;
        background-color: #324057;
    }
    .footer .main{
        width:90%;
        max-width:1400px;
        margin:0 auto;
        color:#C0CCDA;
    }
    .footer .content{
        position: absolute;
    }
    .footer .main .title{
        font-size:24px;
        margin-top:15px;
    }
    .footer .main .subTitle{
        font-size:12px;
        margin-top:5px;
        color:#99A9BF;
    }
    .footer .main .subTitle a{
        color:#F7BA2A
    }
    .footer .contact{
        text-align: center;
        margin-top:12px;
        margin-right:20px;
    }
    .footer .contact a{
        -webkit-transition: color 0.3s;
        -moz-transition: color 0.3s;
        -ms-transition: color 0.3s;
        -o-transition: color 0.3s;
        transition: color 0.3s;
    }
    .footer .github a{
        color:#C0CCDA;
    }
    .footer .github a:hover{
        color:#E5E9F2;
    }
    .footer .github .iconfont{
        font-size:32px;
    }
    .footer .feedback{
        margin-top:2px;
    }
    .footer .feedback a{
        color:#99A9BF;
        font-size:12px;
    }
    .footer .feedback a:hover{
        color:#E5E9F2;
    }
</style>

<script>
    export default{
        data(){
            return {}
        }
    }
</script>