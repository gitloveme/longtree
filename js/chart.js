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
            //var barOption,lineOption,pieOption;
            var barOption,lineOption,pieOption;
            var typeObject={
                "gsdj":{
                    "setClass":"tj-tit-gsdj",
                    "setTitle":"古树等级分布情况",
                    "setIndex":0,
                    "preName":"qyfb",
                    "nextName":"gszs"
                },
                "gszs":{
                    "setClass":"tj-tit-gszs",
                    "setTitle":"古树长势分布情况",
                    "setIndex":1,
                    "preName":"gsdj",
                    "nextName":"szbl"
                },
                "szbl":{
                    "setClass":"tj-tit-szbl",
                    "setTitle":"树种比例分布情况",
                    "setIndex":2,
                    "preName":"gszs",
                    "nextName":"qyfb"
                },
                "qyfb":{
                    "setClass":"tj-tit-qyfb",
                    "setTitle":"各行政区域古树分布情况",
                    "setIndex":3,
                    "preName":"szbl",
                    "nextName":"gsdj"
                }
            };
            //var myChart = ec.init(document.getElementById('tjmap'));
            //type 1:古树等级 2：古树长势 3：古树比例 4： 区域分布
            function init(typename){
                var typeIndex=1; 
                switch(typename){
                    case "gsdj":
                        typeIndex=1;
                        break;
                    case "gszs":
                        typeIndex=2;
                        break;
                    case "szbl":
                        typeIndex=3;
                        break;
                    case "qyfb":
                        typeIndex=4;
                        break;
                }
                
                $.ajax({
                    type:"get",
                    url:"/inf/getTreeStatistics",
                    data:{type:typeIndex},
                    dataType:"json",
                    error:function (error){
                        var errormsg='获取统计信息出错，暂时无法向您展示统计数据'
                        dialogMessage("统计信息",errormsg);
                    },
                    success:function (data){
                        if(data.status==200){
                            localStorage.setItem("chartType",typename);
                            var list=data.data;
                            var barData=[];
                            var barValue=[];
                            var pieData=[];
                            for(var i=0;i<list.length;i++){
                                barData.push(list[i].key);
                                barValue.push(list[i].value);
                                var pieObj={value:list[i].value, name:list[i].key};
                                pieData.push(pieObj);
                            }
                            barOption={
                                tooltip : {
                                    trigger: 'axis'
                                    //,formatter: "{b}<br/>{a}: {c}棵"
                                },
                                xAxis : [
                                    {
                                        //name:"行政区域",
                                        nameTextStyle:{"fontSize":"14","color":"#808080"},
                                        data : barData,                        
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
                                        //name : '树木(棵)',
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
                                       // name:'总数',
                                        type:'bar',
                                        barWidth:20, 
                                        itemStyle: { 
                                            normal: {
                                                color: function(params) {
                                                    var colorList = ['#91a86f','#7fa86f','#6fa870','#6fa88d','#6fa8a6','#7c9fb2','#8699b9','#a0a2c8','#b9a0c8','#ca9dba','#d4a9ac','#d5c096','#c5cc8c','#9ebc80','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83','#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3','#91a86f','#7fa86f','#6fa870','#6fa88d','#6fa8a6','#7c9fb2','#8699b9','#a0a2c8','#b9a0c8','#ca9dba','#d4a9ac','#d5c096','#c5cc8c','#9ebc80','#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83','#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'];
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
                                        data:barValue
                                    }
                                ]

                            };
                            lineOption={
                                tooltip : {
                                    trigger: 'axis'
                                    //,formatter: "{b}<br/>{a}: {c}棵"
                                },
                                xAxis : [
                                    {   
                                        //name:"行政区域",
                                        nameTextStyle:{"fontSize":"14","color":"#808080"},
                                        type : 'category',
                                        boundaryGap : false,
                                        data : barData,
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
                                        //name : '树木(棵)',
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
                                        //name:'树木总数',
                                        type:'line',
                                        itemStyle: {
                                            normal: {
                                                color:"#547543",
                                                lineStyle: {
                                                    shadowColor : 'rgba(0,0,0,0.4)'
                                                }
                                            }
                                        },
                                        data:barValue
                                    }
                                ]
                            };
                            pieOption = {
                                tooltip : {
                                    trigger: 'item'
                                    //,formatter: "{b}<br/>{a}: {c}棵"
                                },
                                series : [
                                    {
                                        //name:'树木总数',
                                        type:'pie',
                                        radius : '55%',
                                        center: ['50%', '50%'],
                                        selectedOffset:20,
                                        data:pieData
                                    }
                                ]
                            };
                            
                            setTongjiData(typeObject[typename]);
                        }else{
                            var errormsg=data.error || '获取统计信息出错，暂时无法向您展示统计数据'
                            dialogMessage("统计信息",errormsg);
                        }
                    }   
                });
            }
            var chartName=localStorage.getItem("chartType") || getQueryString("type") || "gsdj";
            init(chartName);
            
            var bdStyle;
            var loadDom;
            var comBox=$(".commonbox");
            comBox.find(".tj-map-type").find("li").click(function (){
                if($(this).hasClass("active")) return false;
                $(this).addClass("active").siblings().removeClass("active");
                loadChart(loadDom);
            });
            

            
            comBox.find(".tj-arrow").find("div").click(function (){
                var name=$(this).attr("name");
                
                init(name);
            });
            function setTongjiData(obj){
                var setClass=obj.setClass;
                var setTitle=obj.setTitle;
                var setIndex=obj.setIndex;
                if(setIndex==0){
                    comBox.find(".arrow-left").hide();
                }else if(setIndex==3){
                    comBox.find(".arrow-right").hide();
                }else{
                    comBox.find(".arrow-left,.arrow-right").show();
                }
                comBox.find(".tj-tit-img").attr("class","tj-tit-img "+setClass);
                comBox.find(".tj-tit").html(setTitle);
                comBox.find(".showimgs").stop().animate({
                    "marginLeft":-setIndex*comBox.find(".allmapimgs").width()
                },1000);
                comBox.find(".arrow-left").attr("name",obj.preName).siblings(".arrow-right").attr("name",obj.nextName);
                loadDom=comBox.find(".mapimage")[setIndex];

                loadChart(loadDom);
            }
            var myChart;
            function loadChart(dom){
                myChart = require('echarts').init(dom);
                var i=comBox.find(".tj-map-type").find(".active").index();
                bdStyle={
                    "pie":pieOption,
                    "line":lineOption,
                    "bar":barOption
                }
                var typeArry=["pie","line","bar"];
                var option=bdStyle[typeArry[i]] || barOption;
                myChart.dispose;//销毁
                myChart.setOption(option);
                
            }
            
        }
    );
});