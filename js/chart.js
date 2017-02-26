$(function (){
    // 路径配置
    require.config({
        paths: {
            echarts: 'http://echarts.baidu.com/build/dist'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/pie',
            'echarts/chart/bar',
            'echarts/chart/line'
        ],
        function (ec) {
            //var myChart = ec.init(document.getElementById('tjmap'));
            var barOption={
                tooltip : {
                    trigger: 'axis',
                    formatter: "{b}<br/>{a}: {c}棵"
                },
                xAxis : [
                    {
                        name:"行政区域",
                        nameTextStyle:{"fontSize":"14","color":"#808080"},
                        data : ['城北街道','城南街道','南口','沙河','南邵','崔村','阳坊','流村','马池口','十三陵','长陵','北七家'],                        
                        axisLabel:{
                            textStyle: {
                                color: '#808080'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color: '#969696',
                                width: 1,
                                type: 'solid'
                            }  
                        },
                        axisTick:{show:false}
                    }
                ],
                yAxis : [
                    {
                        name : '树木(棵)',
                        nameTextStyle:{"fontSize":"14","color":"#808080"},
                        axisLabel:{
                            textStyle: {
                                color: '#808080'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color: '#969696',
                                width: 1,
                                type: 'solid'
                            }  
                        }
                    }
                ],
                series : [
                    {
                        name:'树木总数',
                        type:'bar',
                        barWidth:20, 
                        itemStyle: { 
                            normal: {
                                color: function(params) {
                                    var colorList = ['#91a86f','#7fa86f','#6fa870','#6fa88d','#6fa8a6','#7c9fb2','#8699b9','#a0a2c8','#b9a0c8','#ca9dba','#d4a9ac','#d5c096','#c5cc8c','#9ebc80','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83','#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
                                    return colorList[params.dataIndex]
                                },

                                label : {
                                    show: true, 
                                    position: 'top',
                                    textStyle: {
                                        color: '#808080'
                                    }
                                }
                            }
                        },
                        data:[20,100,123,400,90,70,230,600,500,400,200,300,445]
                    }
                ]

            };
            var lineOption={
                tooltip : {
                    trigger: 'axis',
                    formatter: "{b}<br/>{a}: {c}棵"
                },
                xAxis : [
                    {   
                        name:"行政区域",
                        nameTextStyle:{"fontSize":"14","color":"#808080"},
                        type : 'category',
                        boundaryGap : false,
                        data : ['城北街道','城南街道','南口','沙河','南邵','崔村','阳坊','流村','马池口','十三陵','长陵','北七家'],
                        axisLabel:{
                            textStyle: {
                                color: '#808080'
                            }
                        },
                        axisLine:{
                            lineStyle:{
                                color: '#969696',
                                width: 1,
                                type: 'solid'
                            }  
                        },
                        axisTick:{show:false}
                    }
                ],
                yAxis : [
                    {   
                        name : '树木(棵)',
                        nameTextStyle:{"fontSize":"14","color":"#808080"},
                        type : 'value',
                        axisLine:{
                            lineStyle:{
                                color: '#969696',
                                width: 1,
                                type: 'solid'
                            }  
                        }
                        
                    }
                ],
                series : [
                    {
                        name:'树木总数',
                        type:'line',
                        itemStyle: {
                            normal: {
                                color:"#547543",
                                lineStyle: {
                                    shadowColor : 'rgba(0,0,0,0.4)'
                                }
                            }
                        },
                        data:[20,100,123,400,90,70,230,600,500,400,200,300,445]
                    }
                ]
            };
            var pieOption = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{b}<br/>{a}: {c}棵"
                },
                series : [
                    {
                        name:'树木总数',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        selectedOffset:20,
                        data:[
                        //['城北街道','','','','','','','','','','','']
                        //[20,100,123,400,90,70,230,600,500,400,200,300,445]
                            {value:20, name:'城北街道'},
                            {value:100, name:'城南街道'},
                            {value:123, name:'南口'},
                            {value:400, name:'沙河'},
                            {value:90, name:'南邵'},
                            {value:70, name:'崔村'},
                            {value:230, name:'阳坊'},
                            {value:600, name:'流村'},
                            {value:500, name:'马池口'},
                            {value:400, name:'十三陵'},
                            {value:200, name:'长陵'},
                            {value:300, name:'北七家'}
                        ]
                    }
                ]
            };
            $(".tj-map-type").find("li").click(function (){
                var that = $(this);
                if(that.hasClass("active")) return false;
                that.addClass("active").siblings().removeClass("active");
                var kind=that.attr("kind");
                if(kind=="pie"){
                    loadChart(pieOption);
                }else if(kind=="line"){

                    loadChart(lineOption);
                }else{//bar
                    loadChart(barOption);
                }
            });
            function loadChart(o){
                console.info(o);
                var myChart = require('echarts').init(document.getElementById('tjmap'));
                myChart.setOption(o);
                myChart.dispose;//销毁
            }
            loadChart(barOption);
        }
    );
});