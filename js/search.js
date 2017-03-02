var map = new BMap.Map("map");  // 创建Map实例 
//new BMap.Point(116.433321,40.10356)
map.centerAndZoom(new BMap.Point(116.404, 39.915),12);// 初始化地图
//map.centerAndZoom(new BMap.Point(116.433,40.103),12);// 初始化地图
map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
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
                    console.log("百度：",arry)
                    var myIcon = new BMap.Icon("http://123.56.168.10/images/tree3.png", new BMap.Size(24,24));
                    for(var i=0;i<arry.length;i++){
                        var point = new BMap.Point(arry[i].x,arry[i].y);
                        var marker = new BMap.Marker(point,{icon:myIcon});
                        map.addOverlay(marker);
                        ////
                        var sContent ='<div class="window">'+
                                '<img src="/images/tree-des-1.jpg" class="treeimg" alt="油松">'+
                                '<div class="btn-more">'+
                                    '<em class="icon ico-eye"></em><a>查看详情</a>'+
                                '</div>'+
                                '<div class="icon ico-arrow"></div>'+
                                '<p class="treeno">NO.110221000590</p>'+
                                '<div class="treedes">'+
                                    '<h3>油松</h3>'+
                                    '<p class="des-en">Pinus tabuliformis Carrière</p>'+
                                    '<p class="des-cn"><em class="icon ico-ori"></em>沙河镇G6高速路以东运河沿岸</p>'+
                                '</div>'+
                            '</div>';
                        var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
                        marker.addEventListener("click", function(data){
                            console.log(data);        
                           this.openInfoWindow(infoWindow);
                        });

                        
                    }
                }
            })

            
        }
    });    
    
}
//打开窗口
function openTreeInfo(){
    // 百度地图API功能
    var sContent =
    "<h4 style='margin:0 0 5px 0;padding:0.2em 0'>天安门</h4>" + 
    "<img style='float:right;margin:4px' id='imgDemo' src='http://app.baidu.com/map/images/tiananmen.jpg' width='139' height='104' title='天安门'/>" + 
    "<p style='margin:0;line-height:1.5;font-size:13px;text-indent:2em'>天安门坐落在中国北京市中心,故宫的南侧,与天安门广场隔长安街相望,是清朝皇城的大门...</p>" + 
    "</div>";
    var map = new BMap.Map("allmap");
    var point = new BMap.Point(116.404, 39.915);
    var marker = new BMap.Marker(point);
    var infoWindow = new BMap.InfoWindow(sContent);  // 创建信息窗口对象
    map.centerAndZoom(point, 15);
    map.addOverlay(marker);
    marker.addEventListener("click", function(){          
       this.openInfoWindow(infoWindow);
       //图片加载完毕重绘infowindow
       document.getElementById('imgDemo').onload = function (){
           infoWindow.redraw();   //防止在网速较慢，图片未加载时，生成的信息框高度比图片的总高度小，导致图片部分被隐藏
       }
    });
}
var confine="115.883057, 40.151437;115.887284, 40.147657;115.907548, 40.14707;115.908386, 40.14421;115.914174, 40.147163;115.928728,40.142455;115.945038,40.128915;115.955111, 40.114708;115.951767, 40.110934;115.962661, 40.103405;115.963911, 40.108494;115.970185, 40.108082;115.966852, 40.099507;115.974382, 40.090151;115.974803, 40.082563;115.989381, 40.090099;115.996854, 40.090471;116.029549, 40.082715;116.037831, 40.088883;116.041152, 40.08699;116.043644, 40.091152;116.056474, 40.092332;116.063592, 40.103311;116.077221, 40.111653;116.081711, 40.121954;116.085391, 40.121436;116.092164, 40.126375;116.10376, 40.127436;116.108368, 40.122302;116.113567, 40.124048;116.120823, 40.121343;116.137391, 40.121312;116.141183, 40.127954;116.177839, 40.130436;116.174848, 40.134699;116.179721, 40.13387;116.176745, 40.143174;116.171412, 40.146314;116.176031, 40.145915;116.176081, 40.148902;116.181289, 40.148843;116.188151, 40.153554;116.190154, 40.164269;116.197998, 40.161694;116.201798, 40.166439;116.209906, 40.167109;116.214447, 40.146781;116.223719, 40.147867;116.239751, 40.142021;116.254817, 40.141222;116.251428, 40.118582;116.246619, 40.114369;116.263369, 40.110845;116.264818, 40.118596;116.269771, 40.117429;116.271527, 40.110243;116.265798, 40.10745;116.280513, 40.097876;116.286401, 40.086145;116.296905, 40.089609;116.310228, 40.066449;116.313008, 40.068525;116.325006, 40.067249;116.335378, 40.06064;116.34552, 40.064731;116.346675, 40.060861;116.349949, 40.061113;116.353507, 40.069364;116.376853, 40.075298;116.379795, 40.071643;116.386902, 40.07159;116.389271, 40.067308;116.378836, 40.063911;116.379802, 40.060106;116.373823, 40.058809;116.376082, 40.05295;116.383805, 40.051522;116.383996, 40.049258;116.399738, 40.047768;116.40177, 40.042853;116.413296, 40.046726;116.415819, 40.06182;116.431517, 40.066402;116.431355, 40.070731;116.455298, 40.064534;116.466889, 40.067011;116.466416, 40.080005;116.47402, 40.091723;116.471647, 40.099089;116.480136, 40.103338;116.487773, 40.102667;116.497395, 40.108927;116.498913, 40.117381;116.485426, 40.153289;116.496164, 40.158723;116.498085, 40.165392;116.486349, 40.166616;116.494696, 40.196216;116.491168, 40.202283;116.478804, 40.210692;116.480214, 40.226625;116.486859, 40.230494;116.4907, 40.228885;116.488313, 40.252547;116.502322, 40.257619;116.507706, 40.25484;116.51162, 40.263267;116.516455, 40.265129;116.494839, 40.272556;116.493572, 40.281946;116.488395, 40.28536;116.480531, 40.285397;116.469937, 40.292329;116.458282, 40.290749;116.457636, 40.303363;116.452201, 40.306928;116.464441, 40.321834;116.452182, 40.328403;116.447157, 40.337971;116.442769, 40.334446;116.423988, 40.335352;116.41422, 40.341222;116.402071, 40.340693;116.396981, 40.344148;116.388953, 40.344325;116.380551, 40.342802;116.382056, 40.337901;116.372839, 40.336757;116.376281, 40.348597;116.37201, 40.353735;116.376726, 40.361695;116.36827, 40.364201;116.355849, 40.361166;116.360343, 40.368736;116.36621, 40.370219;116.364937, 40.372552;116.361203, 40.376377;116.3527, 40.377408;116.332876, 40.391342;116.321341, 40.39417;116.303827, 40.390088;116.301689, 40.397886;116.296986, 40.398024;116.299213, 40.387402;116.293387, 40.380608;116.280782, 40.387389;116.26457, 40.387183;116.260403, 40.380147;116.257195, 40.380038;116.252741, 40.384948;116.251093, 40.382363;116.24065, 40.38042;116.234725, 40.386218;116.221207, 40.38673;116.214762, 40.379096;116.199505, 40.377259;116.199092, 40.375032;116.189468, 40.372643;116.186534, 40.375879;116.176307, 40.370733;116.159665, 40.367393;116.155746, 40.356247;116.165206, 40.347129;116.160332, 40.340202;116.1552, 40.340236;116.155754, 40.352516;116.146032, 40.351712;116.147909, 40.327823;116.151431, 40.323087;116.151021, 40.319726;116.144401, 40.316807;116.130551, 40.316488;116.118115, 40.334339;116.093983, 40.334173;116.090636, 40.340597;116.084567, 40.343559;116.066734, 40.340911;116.060519, 40.330885;116.062405, 40.323996;116.054598, 40.319981;116.047756, 40.321124;116.045314, 40.316911;116.041366, 40.316898;116.035337, 40.330418;116.023531, 40.338866;116.018568, 40.338612;116.009893, 40.332541;116.003269, 40.336743;115.983352, 40.324311;115.985753, 40.311457;115.99905, 40.306349;115.990751, 40.304363;115.985594, 40.296473;115.989218, 40.289274;115.984274, 40.277214;115.973017, 40.271346;115.974803, 40.269453;115.96956, 40.263582;115.939616, 40.261757;115.925633, 40.254556;115.917889, 40.241488;115.905256, 40.241696;115.890773, 40.22004;115.894544, 40.215076;115.878751, 40.193072;115.86747, 40.19034;115.850978, 40.173889;115.860319, 40.154894;115.869017, 40.157034;115.883057, 40.151437";
function init(){
    getBoundary("昌平区");
    //addTreeTileLayer();
    addOverlayTree();
}
init();
/*
    map.enableScrollWheelZoom();
    map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
    var customLayer;
    function addCustomLayer(keyword) {
        if (customLayer) {
            map.removeTileLayer(customLayer);
        }
        customLayer=new BMap.CustomLayer({
            geotableId: 30960,
            q: '', //检索关键字
            tags: '', //空格分隔的多字符串
            filter: '' //过滤条件,参考http://developer.baidu.com/map/lbs-geosearch.htm#.search.nearby
        });
        map.addTileLayer(customLayer);
        customLayer.addEventListener('hotspotclick',callback);
    }
    function callback(e)//单击热点图层
    {
            var customPoi = e.customPoi;//poi的默认字段
            var contentPoi=e.content;//poi的自定义字段
            var content = '<p style="width:280px;margin:0;line-height:20px;">地址：' + customPoi.address + '<br/>价格:'+contentPoi.dayprice+'元'+'</p>';
            var searchInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
                title: customPoi.title, //标题
                width: 290, //宽度
                height: 40, //高度
                panel : "panel", //检索结果面板
                enableAutoPan : true, //自动平移
                enableSendToPhone: true, //是否显示发送到手机按钮
                searchTypes :[
                    BMAPLIB_TAB_SEARCH,   //周边检索
                    BMAPLIB_TAB_TO_HERE,  //到这里去
                    BMAPLIB_TAB_FROM_HERE //从这里出发
                ]
            });
            var point = new BMap.Point(customPoi.point.lng, customPoi.point.lat);
            searchInfoWindow.open(point);
    }
    addCustomLayer();*/
$(function (){
    var data={"footer":null,"rows":[{"objectid1":1,"treeimage":"2015-7-16\/DSC_0181.JPG;2015-7-16\/DSC_0182.JPG;2015-7-16\/DSC_0183.JPG;","sh":"3","abscisa":116.30619963,"pointx":116.30619963,"pointy":39.93356950,"ordinate":39.93356950,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800591","oldno":""},{"objectid1":2,"treeimage":"2015-7-16\/DSC_0178.JPG;2015-7-16\/DSC_0179.JPG;2015-7-16\/DSC_0180.JPG;","sh":"3","abscisa":116.30620671,"pointx":116.30620671,"pointy":39.93369932,"ordinate":39.93369932,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800592","oldno":""},{"objectid1":3,"treeimage":"2015-7-16\/DSC_0188.JPG;2015-7-16\/DSC_0189.JPG;","sh":"3","abscisa":116.30668319,"pointx":116.30668319,"pointy":39.93369968,"ordinate":39.93369968,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800593","oldno":""},{"objectid1":4,"treeimage":"2015-7-16\/DSC_0175.JPG;2015-7-16\/DSC_0176.JPG;2015-7-16\/DSC_0177.JPG;","sh":"3","abscisa":116.30643036,"pointx":116.30643036,"pointy":39.93363125,"ordinate":39.93363125,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800594","oldno":""},{"objectid1":5,"treeimage":"2015-7-16\/DSC_0357.JPG;2015-7-16\/DSC_0358.JPG;","sh":"3","abscisa":116.28981650,"pointx":116.28981650,"pointy":39.93542739,"ordinate":39.93542739,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800596","oldno":""},{"objectid1":6,"treeimage":"2015-7-16\/DSC_0354.JPG;2015-7-16\/DSC_0355.JPG;","sh":"3","abscisa":116.28976246,"pointx":116.28976246,"pointy":39.93546961,"ordinate":39.93546961,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800597","oldno":""},{"objectid1":7,"treeimage":"2015-7-16\/DSC_0289.JPG;2015-7-16\/DSC_0290.JPG;2015-7-16\/DSC_0291.JPG;","sh":"3","abscisa":116.28975540,"pointx":116.28975540,"pointy":39.93549160,"ordinate":39.93549160,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800598","oldno":""},{"objectid1":8,"treeimage":"2015-7-16\/DSC_0360.JPG;2015-7-16\/DSC_0361.JPG;","sh":"3","abscisa":116.28985452,"pointx":116.28985452,"pointy":39.93544218,"ordinate":39.93544218,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800599","oldno":""},{"objectid1":9,"treeimage":"2015-7-16\/DSC_0310.JPG;2015-7-16\/DSC_0311.JPG;2015-7-16\/DSC_0312.JPG;","sh":"3","abscisa":116.28968641,"pointx":116.28968641,"pointy":39.93575142,"ordinate":39.93575142,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800600","oldno":""},{"objectid1":10,"treeimage":"2015-7-16\/DSC_0363.JPG;2015-7-16\/DSC_0364.JPG;","sh":"3","abscisa":116.28983958,"pointx":116.28983958,"pointy":39.93550733,"ordinate":39.93550733,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800601","oldno":""},{"objectid1":11,"treeimage":"2015-7-16\/DSC_0369.JPG;2015-7-16\/DSC_0370.JPG;","sh":"3","abscisa":116.28974752,"pointx":116.28974752,"pointy":39.93556053,"ordinate":39.93556053,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800602","oldno":""},{"objectid1":12,"treeimage":"2015-7-16\/DSC_0366.JPG;2015-7-16\/DSC_0367.JPG;","sh":"3","abscisa":116.28986267,"pointx":116.28986267,"pointy":39.93554523,"ordinate":39.93554523,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800603","oldno":""},{"objectid1":13,"treeimage":"2015-7-16\/DSC_0298.JPG;2015-7-16\/DSC_0299.JPG;2015-7-16\/DSC_0300.JPG;","sh":"3","abscisa":116.28955607,"pointx":116.28955607,"pointy":39.93561484,"ordinate":39.93561484,"subplace":"21世纪实验中学-外教楼后院","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800604","oldno":""},{"objectid1":14,"treeimage":"2015-7-16\/DSC_0396.JPG;2015-7-16\/DSC_0397.JPG;","sh":"3","abscisa":116.29026762,"pointx":116.29026762,"pointy":39.93539896,"ordinate":39.93539896,"subplace":"21世纪实验中学-小青楼南侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"楸树","treeid":"11010800605","oldno":""},{"objectid1":15,"treeimage":"2015-7-16\/DSC_0466.JPG;2015-7-16\/DSC_0467.JPG;","sh":"3","abscisa":116.28806641,"pointx":116.28806641,"pointy":39.93649802,"ordinate":39.93649802,"subplace":"亮甲店1号人民政协报院内","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"政协报社","specie":"侧柏","treeid":"11010800606","oldno":""},{"objectid1":16,"treeimage":"2015-7-16\/DSC_0375.JPG;2015-7-16\/DSC_0376.JPG;","sh":"3","abscisa":116.28987786,"pointx":116.28987786,"pointy":39.93603726,"ordinate":39.93603726,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"总后干休所","specie":"国槐","treeid":"11010800607","oldno":""},{"objectid1":17,"treeimage":"2015-7-16\/DSC_0372.JPG;2015-7-16\/DSC_0373.JPG;","sh":"3","abscisa":116.28974751,"pointx":116.28974751,"pointy":39.93585458,"ordinate":39.93585458,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800608","oldno":""},{"objectid1":18,"treeimage":"2015-7-16\/DSC_0295.JPG;2015-7-16\/DSC_0296.JPG;2015-7-16\/DSC_0297.JPG;","sh":"3","abscisa":116.28967148,"pointx":116.28967148,"pointy":39.93551466,"ordinate":39.93551466,"subplace":"21世纪实验中学-篮球厂北侧山上","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800609","oldno":""},{"objectid1":19,"treeimage":"2015-7-16\/DSC_0328.JPG;2015-7-16\/DSC_0329.JPG;2015-7-16\/DSC_0330.JPG;","sh":"3","abscisa":116.28982355,"pointx":116.28982355,"pointy":39.93598427,"ordinate":39.93598427,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800611","oldno":""},{"objectid1":20,"treeimage":"2015-7-16\/DSC_0325.JPG;2015-7-16\/DSC_0326.JPG;2015-7-16\/DSC_0327.JPG;","sh":"3","abscisa":116.28971736,"pointx":116.28971736,"pointy":39.93595342,"ordinate":39.93595342,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"油松","treeid":"11010800612","oldno":""}],"total":"3771"}
});