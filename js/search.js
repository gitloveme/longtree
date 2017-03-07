var map = new BMap.Map("map");  // 创建Map实例 
//new BMap.Point(116.433321,40.10356)
map.centerAndZoom(new BMap.Point(116.404, 39.915),12);// 初始化地图
//map.centerAndZoom(new BMap.Point(116.433,40.103),12);// 初始化地图
map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
map.addControl(new BMap.ScaleControl({anchor:BMAP_ANCHOR_BOTTOM_RIGHT})); // 添加比例尺控件
map.addControl(new BMap.OverviewMapControl()); // 添加缩略地图控件
map.enableScrollWheelZoom(true); // 启用滚轮放大缩小
map.addControl(new BMap.MapTypeControl()); // 添加地图类型控件
map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
var stCtrl = new BMap.PanoramaControl(); // 构造全景控件
stCtrl.setOffset(new BMap.Size(10, 35));
map.addControl(stCtrl);// 添加全景控件 
var myDistance = new BMapLib.DistanceTool(map);//测距
/*工具开关*/
//添加拉框放大
var myDrag;
var myDragflag=0;
//拉框放大
function mapZoomUp(){
    if(myDragflag==1){
        myDrag.close();
        myDragflag=0;
    }
    myDrag = new BMapLib.RectangleZoom(map, {zoomType : 0 ,followText: "拖拽鼠标进行放大"});
    myDrag.open();
    myDragflag=1;
}
//拉框缩小
function mapZoomDown(){
    if(myDragflag==1){
        myDrag.close();
        myDragflag=0;
        }
    myDrag = new BMapLib.RectangleZoom(map, {zoomType : 1 ,followText: "拖拽鼠标进行缩小"});
    myDrag.open();
    myDragflag=1;
}
//测量距离
function openDistance(){
    if(myDragflag==1){
        myDrag.close();
        myDragflag=0;
    }   
    var distance = new BMapLib.DistanceTool(map);
    distance.open();
}
//计算面积
function getAcreage(){
    if(myDragflag==1){
        myDrag.close();
        myDragflag=0;
    }   
    var styleOptions = {
        strokeColor:"red",    //边线颜色。
        fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3,       //边线的宽度，以像素为单位。
        strokeOpacity: 0.8,    //边线透明度，取值范围0 - 1。
        fillOpacity: 0.6,      //填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' //边线的样式，solid或dashed。
    }
    var drawingManager = new BMapLib.DrawingManager(map, {
        isOpen: true,//是否开启绘制模式     
        drawingToolOptions: {
        anchor: BMAP_ANCHOR_TOP_RIGHT, //位置
        offset: new BMap.Size(5, 5) //偏离值

        },
        enableCalculate:true,//面积
        polygonOptions: styleOptions //多边形的样式
    });
    drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON);//画图模板
    drawingManager.addEventListener("polygoncomplete", function(e) {
        myDrag.close();
        myDragflag=0;
        //var area = BMapLib.GeoUtils.getPolygonArea(e.getPath());
        //alert("共" + ForDight(parseInt(area.toFixed(2))/1000000,3) + "平方公里");
    });
    myDrag=drawingManager;
    myDragflag=1;
}

//清理覆盖物
function clearToolPloy(){
    map.clearOverlays();
    addOverlayTree(confine);
    moveMap();
}

//拖拽地图
function moveMap(){
    if(myDragflag==1){
        myDrag.close();
        myDragflag=0;
    }   
    map.enableDragging();
}
/*绘制行政区域*/
var overlayOffice;
function getBoundary(name){
    var bdary = new BMap.Boundary();
    bdary.get(name, function(rs){//获取行政区域
        map.removeOverlay(overlayOffice);
        var arry=rs.boundaries[0].split(";");
        var len=arry.length;
        var polygon=[];
        var viewArry=[];
        for(var i=0;i<len;i++){
            polygon.push(new BMap.Point(arry[i].split(",")[0],arry[i].split(",")[1]));
            var view={lat:arry[i].split(",")[1],lng:arry[i].split(",")[0]};
            viewArry.push(view);
        }
        overlayOffice = new BMap.Polyline(polygon,{strokeColor:"red", strokeWeight:2, strokeOpacity:1,enableMassClear:false});
        map.addOverlay(overlayOffice);
        //map.setViewport(viewArry);
    });
}
/*添加树木*/
var treeLayer;
function addTreeTileLayer(){
    if(treeLayer) map.removeTileLayer(treeLayer);//先移除 
    treeLayer = new BMap.TileLayer({isTransparentPng: true});  // 创建地图层实例 
    treeLayer.getTilesUrl = function(tileCoord, zoom) {
        var PointConvert = new BaiduPointConvert(map);//百度坐标转换类  
        var lonlat_0 = PointConvert.tileToLngLat(tileCoord);//百度区块左下角经纬度  
        var tileCoord2 = new Object();  
        tileCoord2.x = x + 1;  
        tileCoord2.y = y + 1;  
        var lonlat2_0 = PointConvert.tileToLngLat(tileCoord2);//百度区块右下角经纬度  
        var lonlat_1=BD2GCJ(lonlat_0.lng, lonlat_0.lat);//百度转gcj  
        var lonlat2_1 = BD2GCJ(lonlat2_0.lng, lonlat2_0.lat);//百度转gcj  
        var lonlat = GCJ2WGS(lonlat_1.lng, lonlat_1.lat);//gcj转wgs  
        var lonlat2 = GCJ2WGS(lonlat2_1.lng, lonlat2_1.lat);//gcj转wgs  
        var worldCoordinate14 = lonLat2Mercator(lonlat);//转平面坐标  
        var worldCoordinate24 = lonLat2Mercator(lonlat2);//转平面坐标  
        var url= "*/MapServer/export?bbox=" + worldCoordinate14.x+ "%2C" + worldCoordinate14.y + "%2C"   
        + worldCoordinate24.x + "%2C" + worldCoordinate24.y  
        +"&bboxSR=102100&layers=&layerDefs=&size=256%2C256&imageSR=102100&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=image";  
      return url;//图片 通过arcgis server返回，后期可以把图片下载下来后就抛弃server，然后以瓦片x，y，z命名  

    };      
    map.addTileLayer(treeLayer);
}
function addOverlayTree(){
    $.ajax({
        type:"get",
        url:"/inf/getLocation",
        data:{},
        dataType:"json",
        error:function (error){console.error("获取位置信息出错")},
        success:function (data){
            var baiduData=data.data;
            var sentString='';
            for(var i=0;i<baiduData.length;i++){
                if(i==baiduData.length-1){
                    sentString+=baiduData[i].X+","+baiduData[i].Y;
                }else{
                    sentString+=baiduData[i].X+","+baiduData[i].Y+";";
                }
                
            }
            $.ajax({
                type:"get",
                url:"http://api.map.baidu.com/geoconv/v1/",
                data:{coords:sentString,ak:"2lekLZRu8XcblvoAMksUK3qmGnISyCSP"},
                dataType:"jsonp",
                success:function (bddata){
                    if(bddata.status !=0) return false;
                    var arry=bddata.result;    
                    if(arry.length==0) return false;
                    var myIcon = new BMap.Icon("http://123.56.168.10/images/tree3.png", new BMap.Size(24,24));
                    for(var i=0;i<arry.length;i++){
                        var point = new BMap.Point(arry[i].x,arry[i].y);
                        var marker = new BMap.Marker(point,{icon:myIcon});
                        map.addOverlay(marker);
                        var NO=baiduData[i].NO || 0;
                        var sContent ='<div class="window" style="display:block;position:relative;"><div class="close-window">×</div>'+
                                '<img src="http://123.56.168.10/images/tree-des-1.jpg" class="treeimg" alt="油松">'+
                                '<div class="btn-more">'+
                                    '<em class="icon ico-eye"></em><a>查看详情</a>'+
                                '</div>'+
                                '<div class="icon ico-arrow" style="left:157px;"></div>'+
                                '<p class="treeno">NO.'+NO+'</p>'+
                                '<div class="treedes">'+
                                    '<h3>油松</h3>'+
                                    '<p class="des-en">Pinus tabuliformis Carrière</p>'+
                                    '<p class="des-cn"><em class="icon ico-ori"></em>沙河镇G6高速路以东运河沿岸</p>'+
                                '</div>'+
                            '</div>';
                        addClickHandler(sContent,marker);
                    }
                    function addClickHandler(content,marker){
                        marker.addEventListener("click",function(e){
                            openInfoWindow(content,e,this)}
                        );
                    }
                    function openInfoWindow(content,e,that){
                        var opts = {
                               // title  : "昌平园林绿化局",      //标题
                                width  : 390,//自动加了10像素             //宽度
                                height : 325,              //高度
                                panel  : "panel",         //检索结果面板
                                enableAutoPan : true,     //自动平移
                                enableSendToPhone:false,
                                searchTypes   :[
                                    /*BMAPLIB_TAB_SEARCH,   //周边检索
                                    BMAPLIB_TAB_TO_HERE,  //到这里去
                                    BMAPLIB_TAB_FROM_HERE //从这里出发*/
                                ]
                            }
                            var searchInfoWindow = new BMapLib.SearchInfoWindow(map,content,opts);  // 创建信息窗口对象
                            searchInfoWindow.open(that);
                            $(".close-window").unbind("click").click(function (){
                                searchInfoWindow.close(that);
                                $(this).parents(".window-detail").hide();
                            }).siblings(".btn-more").unbind("click").click(function (){
                                searchInfoWindow.close(that);
                                $(".window-detail").show();
                            });
                    }
                }
            })

            
        }
    });    
    
}
//打开窗口

var searchList=$(".search-list");
function loadSearchData(){
    $.ajax({
        type:"get",
        url:"/inf/getLocation",
        data:{},
        dataType:"json",
        error:function (error){console.error("获取信息出错")},
        success:function (data){
            if(data && data.status == 200){
                var arry=data.data || [];
                if(arry.length<1) return false;
                var table='';
                for(var i=0;i<arry.length;i++){
                    var postNum=arry[i].NO || "树木编号";
                    var treeAdress=arry[i].adress || "树木归属地区";
                    var treeType=arry[i].type || "银杏";
                    var lng=arry[i].X || 0;
                    var lat=arry[i].Y || 0;
                    table+='<tr lng="'+lng+'" lat="'+lat+'" postnum="'+postNum+'">'+
                               '<td>'+postNum+'</td>'+
                               '<td>'+treeAdress+'</td>'+
                               '<td>'+treeType+'</td>'
                            '</tr>';
                }
                var th='<tr><th>编号<em class="icon arrow-s"></em></th><th>地区</th><th style="padding-right:6px;">树种</th></tr>';
                var copytable='<table>'+th+table+'</table>';
                var scrolltable='<table>'+table+'</table>';
                
                searchList.show().find(".copytable").empty().html(copytable).siblings(".autoscroll").empty().html(scrolltable).delegate("tr","click",function (){
                    $(this).addClass("active").siblings("tr").removeClass("active");
                    var coords=$(this).attr("lng")+","+$(this).attr("lat");
                    var NO=$(this).attr("postnum");
                    $.ajax({
                        type:"get",
                        url:"http://api.map.baidu.com/geoconv/v1/",
                        data:{coords:coords,ak:"2lekLZRu8XcblvoAMksUK3qmGnISyCSP"},
                        dataType:"jsonp",
                        success:function (bddata){
                            if(bddata.status !=0) return false;
                            var arry=bddata.result;    
                            if(arry.length==0) return false;
                            var point = new BMap.Point(arry[0].x,arry[0].y);
                            map.centerAndZoom(point, 18);
                            var sContent ='<div class="window" style="display:block;position:relative;"><div class="close-window">×</div>'+
                                '<img src="http://123.56.168.10/images/tree-des-1.jpg" class="treeimg" alt="油松">'+
                                '<div class="btn-more">'+
                                    '<em class="icon ico-eye"></em><a>查看详情</a>'+
                                '</div>'+
                                '<div class="icon ico-arrow" style="left:157px;"></div>'+
                                '<p class="treeno">NO.'+NO+'</p>'+
                                '<div class="treedes">'+
                                    '<h3>油松</h3>'+
                                    '<p class="des-en">Pinus tabuliformis Carrière</p>'+
                                    '<p class="des-cn"><em class="icon ico-ori"></em>沙河镇G6高速路以东运河沿岸</p>'+
                                '</div>'+
                            '</div>';
                            var opts = {
                               // title  : "昌平园林绿化局",      //标题
                                width  : 390,//自动加了10像素             //宽度
                                height : 325,              //高度
                                panel  : "panel",         //检索结果面板
                                enableAutoPan : true,     //自动平移
                                enableSendToPhone:false,
                                searchTypes   :[
                                    /*BMAPLIB_TAB_SEARCH,   //周边检索
                                    BMAPLIB_TAB_TO_HERE,  //到这里去
                                    BMAPLIB_TAB_FROM_HERE //从这里出发*/
                                ]
                            }
                            var searchInfoWindow = new BMapLib.SearchInfoWindow(map,sContent,opts);  // 创建信息窗口对象
                            searchInfoWindow.open(point);
                            $(".close-window").unbind("click").click(function (){
                                searchInfoWindow.close(point);
                                $(this).parents(".window-detail").hide();
                            }).siblings(".btn-more").unbind("click").click(function (){
                                searchInfoWindow.close(point);
                                $(".window-detail").show();
                            });;
                        }
                    });
                });
            }
        }
    })
}
$(".window").find(".btn-more").click(function (){

});
function init(){
    getBoundary("昌平区");
    loadSearchData();
    //addTreeTileLayer();
    addOverlayTree();
}
init();

$(function (){
    var data={"footer":null,"rows":[{"objectid1":1,"treeimage":"2015-7-16\/DSC_0181.JPG;2015-7-16\/DSC_0182.JPG;2015-7-16\/DSC_0183.JPG;","sh":"3","abscisa":116.30619963,"pointx":116.30619963,"pointy":39.93356950,"ordinate":39.93356950,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800591","oldno":""},{"objectid1":2,"treeimage":"2015-7-16\/DSC_0178.JPG;2015-7-16\/DSC_0179.JPG;2015-7-16\/DSC_0180.JPG;","sh":"3","abscisa":116.30620671,"pointx":116.30620671,"pointy":39.93369932,"ordinate":39.93369932,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800592","oldno":""},{"objectid1":3,"treeimage":"2015-7-16\/DSC_0188.JPG;2015-7-16\/DSC_0189.JPG;","sh":"3","abscisa":116.30668319,"pointx":116.30668319,"pointy":39.93369968,"ordinate":39.93369968,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800593","oldno":""},{"objectid1":4,"treeimage":"2015-7-16\/DSC_0175.JPG;2015-7-16\/DSC_0176.JPG;2015-7-16\/DSC_0177.JPG;","sh":"3","abscisa":116.30643036,"pointx":116.30643036,"pointy":39.93363125,"ordinate":39.93363125,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800594","oldno":""},{"objectid1":5,"treeimage":"2015-7-16\/DSC_0357.JPG;2015-7-16\/DSC_0358.JPG;","sh":"3","abscisa":116.28981650,"pointx":116.28981650,"pointy":39.93542739,"ordinate":39.93542739,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800596","oldno":""},{"objectid1":6,"treeimage":"2015-7-16\/DSC_0354.JPG;2015-7-16\/DSC_0355.JPG;","sh":"3","abscisa":116.28976246,"pointx":116.28976246,"pointy":39.93546961,"ordinate":39.93546961,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800597","oldno":""},{"objectid1":7,"treeimage":"2015-7-16\/DSC_0289.JPG;2015-7-16\/DSC_0290.JPG;2015-7-16\/DSC_0291.JPG;","sh":"3","abscisa":116.28975540,"pointx":116.28975540,"pointy":39.93549160,"ordinate":39.93549160,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800598","oldno":""},{"objectid1":8,"treeimage":"2015-7-16\/DSC_0360.JPG;2015-7-16\/DSC_0361.JPG;","sh":"3","abscisa":116.28985452,"pointx":116.28985452,"pointy":39.93544218,"ordinate":39.93544218,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800599","oldno":""},{"objectid1":9,"treeimage":"2015-7-16\/DSC_0310.JPG;2015-7-16\/DSC_0311.JPG;2015-7-16\/DSC_0312.JPG;","sh":"3","abscisa":116.28968641,"pointx":116.28968641,"pointy":39.93575142,"ordinate":39.93575142,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800600","oldno":""},{"objectid1":10,"treeimage":"2015-7-16\/DSC_0363.JPG;2015-7-16\/DSC_0364.JPG;","sh":"3","abscisa":116.28983958,"pointx":116.28983958,"pointy":39.93550733,"ordinate":39.93550733,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800601","oldno":""},{"objectid1":11,"treeimage":"2015-7-16\/DSC_0369.JPG;2015-7-16\/DSC_0370.JPG;","sh":"3","abscisa":116.28974752,"pointx":116.28974752,"pointy":39.93556053,"ordinate":39.93556053,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800602","oldno":""},{"objectid1":12,"treeimage":"2015-7-16\/DSC_0366.JPG;2015-7-16\/DSC_0367.JPG;","sh":"3","abscisa":116.28986267,"pointx":116.28986267,"pointy":39.93554523,"ordinate":39.93554523,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800603","oldno":""},{"objectid1":13,"treeimage":"2015-7-16\/DSC_0298.JPG;2015-7-16\/DSC_0299.JPG;2015-7-16\/DSC_0300.JPG;","sh":"3","abscisa":116.28955607,"pointx":116.28955607,"pointy":39.93561484,"ordinate":39.93561484,"subplace":"21世纪实验中学-外教楼后院","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800604","oldno":""},{"objectid1":14,"treeimage":"2015-7-16\/DSC_0396.JPG;2015-7-16\/DSC_0397.JPG;","sh":"3","abscisa":116.29026762,"pointx":116.29026762,"pointy":39.93539896,"ordinate":39.93539896,"subplace":"21世纪实验中学-小青楼南侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"楸树","treeid":"11010800605","oldno":""},{"objectid1":15,"treeimage":"2015-7-16\/DSC_0466.JPG;2015-7-16\/DSC_0467.JPG;","sh":"3","abscisa":116.28806641,"pointx":116.28806641,"pointy":39.93649802,"ordinate":39.93649802,"subplace":"亮甲店1号人民政协报院内","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"政协报社","specie":"侧柏","treeid":"11010800606","oldno":""},{"objectid1":16,"treeimage":"2015-7-16\/DSC_0375.JPG;2015-7-16\/DSC_0376.JPG;","sh":"3","abscisa":116.28987786,"pointx":116.28987786,"pointy":39.93603726,"ordinate":39.93603726,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"总后干休所","specie":"国槐","treeid":"11010800607","oldno":""},{"objectid1":17,"treeimage":"2015-7-16\/DSC_0372.JPG;2015-7-16\/DSC_0373.JPG;","sh":"3","abscisa":116.28974751,"pointx":116.28974751,"pointy":39.93585458,"ordinate":39.93585458,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800608","oldno":""},{"objectid1":18,"treeimage":"2015-7-16\/DSC_0295.JPG;2015-7-16\/DSC_0296.JPG;2015-7-16\/DSC_0297.JPG;","sh":"3","abscisa":116.28967148,"pointx":116.28967148,"pointy":39.93551466,"ordinate":39.93551466,"subplace":"21世纪实验中学-篮球厂北侧山上","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800609","oldno":""},{"objectid1":19,"treeimage":"2015-7-16\/DSC_0328.JPG;2015-7-16\/DSC_0329.JPG;2015-7-16\/DSC_0330.JPG;","sh":"3","abscisa":116.28982355,"pointx":116.28982355,"pointy":39.93598427,"ordinate":39.93598427,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800611","oldno":""},{"objectid1":20,"treeimage":"2015-7-16\/DSC_0325.JPG;2015-7-16\/DSC_0326.JPG;2015-7-16\/DSC_0327.JPG;","sh":"3","abscisa":116.28971736,"pointx":116.28971736,"pointy":39.93595342,"ordinate":39.93595342,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"油松","treeid":"11010800612","oldno":""}],"total":"3771"}
});