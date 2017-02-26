var map = new BMap.Map("map");  // 创建Map实例
map.centerAndZoom("北京",15);// 初始化地图,用城市名设置地图中心点
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
    document.getElementById("open").onclick = function(){
        addCustomLayer();
    };
    document.getElementById("open").click();
    document.getElementById("close").onclick = function(){
        if (customLayer) {
            map.removeTileLayer(customLayer);
        }
    };
$(function (){
    var data={"footer":null,"rows":[{"objectid1":1,"treeimage":"2015-7-16\/DSC_0181.JPG;2015-7-16\/DSC_0182.JPG;2015-7-16\/DSC_0183.JPG;","sh":"3","abscisa":116.30619963,"pointx":116.30619963,"pointy":39.93356950,"ordinate":39.93356950,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800591","oldno":""},{"objectid1":2,"treeimage":"2015-7-16\/DSC_0178.JPG;2015-7-16\/DSC_0179.JPG;2015-7-16\/DSC_0180.JPG;","sh":"3","abscisa":116.30620671,"pointx":116.30620671,"pointy":39.93369932,"ordinate":39.93369932,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800592","oldno":""},{"objectid1":3,"treeimage":"2015-7-16\/DSC_0188.JPG;2015-7-16\/DSC_0189.JPG;","sh":"3","abscisa":116.30668319,"pointx":116.30668319,"pointy":39.93369968,"ordinate":39.93369968,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800593","oldno":""},{"objectid1":4,"treeimage":"2015-7-16\/DSC_0175.JPG;2015-7-16\/DSC_0176.JPG;2015-7-16\/DSC_0177.JPG;","sh":"3","abscisa":116.30643036,"pointx":116.30643036,"pointy":39.93363125,"ordinate":39.93363125,"subplace":"北洼路老街7号-八里庄小学","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"八庄里小学","specie":"侧柏","treeid":"11010800594","oldno":""},{"objectid1":5,"treeimage":"2015-7-16\/DSC_0357.JPG;2015-7-16\/DSC_0358.JPG;","sh":"3","abscisa":116.28981650,"pointx":116.28981650,"pointy":39.93542739,"ordinate":39.93542739,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800596","oldno":""},{"objectid1":6,"treeimage":"2015-7-16\/DSC_0354.JPG;2015-7-16\/DSC_0355.JPG;","sh":"3","abscisa":116.28976246,"pointx":116.28976246,"pointy":39.93546961,"ordinate":39.93546961,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800597","oldno":""},{"objectid1":7,"treeimage":"2015-7-16\/DSC_0289.JPG;2015-7-16\/DSC_0290.JPG;2015-7-16\/DSC_0291.JPG;","sh":"3","abscisa":116.28975540,"pointx":116.28975540,"pointy":39.93549160,"ordinate":39.93549160,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800598","oldno":""},{"objectid1":8,"treeimage":"2015-7-16\/DSC_0360.JPG;2015-7-16\/DSC_0361.JPG;","sh":"3","abscisa":116.28985452,"pointx":116.28985452,"pointy":39.93544218,"ordinate":39.93544218,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800599","oldno":""},{"objectid1":9,"treeimage":"2015-7-16\/DSC_0310.JPG;2015-7-16\/DSC_0311.JPG;2015-7-16\/DSC_0312.JPG;","sh":"3","abscisa":116.28968641,"pointx":116.28968641,"pointy":39.93575142,"ordinate":39.93575142,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800600","oldno":""},{"objectid1":10,"treeimage":"2015-7-16\/DSC_0363.JPG;2015-7-16\/DSC_0364.JPG;","sh":"3","abscisa":116.28983958,"pointx":116.28983958,"pointy":39.93550733,"ordinate":39.93550733,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800601","oldno":""},{"objectid1":11,"treeimage":"2015-7-16\/DSC_0369.JPG;2015-7-16\/DSC_0370.JPG;","sh":"3","abscisa":116.28974752,"pointx":116.28974752,"pointy":39.93556053,"ordinate":39.93556053,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800602","oldno":""},{"objectid1":12,"treeimage":"2015-7-16\/DSC_0366.JPG;2015-7-16\/DSC_0367.JPG;","sh":"3","abscisa":116.28986267,"pointx":116.28986267,"pointy":39.93554523,"ordinate":39.93554523,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800603","oldno":""},{"objectid1":13,"treeimage":"2015-7-16\/DSC_0298.JPG;2015-7-16\/DSC_0299.JPG;2015-7-16\/DSC_0300.JPG;","sh":"3","abscisa":116.28955607,"pointx":116.28955607,"pointy":39.93561484,"ordinate":39.93561484,"subplace":"21世纪实验中学-外教楼后院","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800604","oldno":""},{"objectid1":14,"treeimage":"2015-7-16\/DSC_0396.JPG;2015-7-16\/DSC_0397.JPG;","sh":"3","abscisa":116.29026762,"pointx":116.29026762,"pointy":39.93539896,"ordinate":39.93539896,"subplace":"21世纪实验中学-小青楼南侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"楸树","treeid":"11010800605","oldno":""},{"objectid1":15,"treeimage":"2015-7-16\/DSC_0466.JPG;2015-7-16\/DSC_0467.JPG;","sh":"3","abscisa":116.28806641,"pointx":116.28806641,"pointy":39.93649802,"ordinate":39.93649802,"subplace":"亮甲店1号人民政协报院内","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"政协报社","specie":"侧柏","treeid":"11010800606","oldno":""},{"objectid1":16,"treeimage":"2015-7-16\/DSC_0375.JPG;2015-7-16\/DSC_0376.JPG;","sh":"3","abscisa":116.28987786,"pointx":116.28987786,"pointy":39.93603726,"ordinate":39.93603726,"subplace":"21世纪实验中学-外教楼北侧","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"总后干休所","specie":"国槐","treeid":"11010800607","oldno":""},{"objectid1":17,"treeimage":"2015-7-16\/DSC_0372.JPG;2015-7-16\/DSC_0373.JPG;","sh":"3","abscisa":116.28974751,"pointx":116.28974751,"pointy":39.93585458,"ordinate":39.93585458,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800608","oldno":""},{"objectid1":18,"treeimage":"2015-7-16\/DSC_0295.JPG;2015-7-16\/DSC_0296.JPG;2015-7-16\/DSC_0297.JPG;","sh":"3","abscisa":116.28967148,"pointx":116.28967148,"pointy":39.93551466,"ordinate":39.93551466,"subplace":"21世纪实验中学-篮球厂北侧山上","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800609","oldno":""},{"objectid1":19,"treeimage":"2015-7-16\/DSC_0328.JPG;2015-7-16\/DSC_0329.JPG;2015-7-16\/DSC_0330.JPG;","sh":"3","abscisa":116.28982355,"pointx":116.28982355,"pointy":39.93598427,"ordinate":39.93598427,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"侧柏","treeid":"11010800611","oldno":""},{"objectid1":20,"treeimage":"2015-7-16\/DSC_0325.JPG;2015-7-16\/DSC_0326.JPG;2015-7-16\/DSC_0327.JPG;","sh":"3","abscisa":116.28971736,"pointx":116.28971736,"pointy":39.93595342,"ordinate":39.93595342,"subplace":"21世纪实验中学-外教楼北侧山坡","currState":"正常","treeno":"","townid":"八里庄","clafcation":"2","respunits":"21世纪中学","specie":"油松","treeid":"11010800612","oldno":""}],"total":"3771"}
});