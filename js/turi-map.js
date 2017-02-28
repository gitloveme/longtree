var tileLayer=null;
var map = null;
var _printWin = null;
var index = 0;
var marker =null;
var marker_index = 0;
var rgbArray = new Array("#8B2323", "#9400D3", "#191970", "#FF1493", "#8B6914",	"#218868", "#FF0000", "#FFD700");
var myGeo = new BMap.Geocoder();
//空间查询相关
var myGeo = null;//地址解析器
var reqParam = new Object();//请求的数据
var drawingManager;//鼠标绘制工具
var flag = 1;//控制图形是否显示，默认1为显示，0为消失
var overlays = null;//存储画出的图形
var myDragflag=0;
var myDrag;
var markers = new Array();//存储小区在地图上的标注


/**
 * 加载地图
 */
function initMap() {
	try {
		map = new BMap.Map("allmap", 
		{defaultCursor : 'default',minZoom :10,maxZoom : 21});
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);
		map.addControl(new BMap.NavigationControl()); // 添加平移缩放控件
		map.addControl(new BMap.ScaleControl()); // 添加比例尺控件
		map.addControl(new BMap.OverviewMapControl()); // 添加缩略地图控件
		map.enableScrollWheelZoom(true); // 启用滚轮放大缩小
		map.addControl(new BMap.MapTypeControl()); // 添加地图类型控件
		map.setCurrentCity("北京"); // 设置地图显示的城市 此项是必须设置的
		var stCtrl = new BMap.PanoramaControl(); // 构造全景控件
		stCtrl.setOffset(new BMap.Size(10, 35));
		map.addControl(stCtrl);// 添加全景控件  	
		rightMenu();
		addTreeWms();

	} catch (err) {
		alert(err.message);
	}	
};

/**
 * wms，添加古树的点到地图上
 */
function addTreeWms(){
	// 百度地图API功能
	treeLayer = new BMap.TileLayer({isTransparentPng: true});
	treeLayer.getTilesUrl = function(tileCoord, zoom) {
		//瓦片坐标
		var tileX = tileCoord.x;
		var tileY = tileCoord.y;
		var projection = map.getMapType().getProjection();
		//平面坐标
		x=tileX*256/Math.pow(2, map.getZoom() - 18);
		y=tileY*256/Math.pow(2, map.getZoom() - 18);
		
		var p1=new BMap.Pixel(x,y);
		
		x2=(tileX+1)*256/Math.pow(2, map.getZoom() - 18);
		y2=(tileY+1)*256/Math.pow(2, map.getZoom() - 18);
		
		var p2=new BMap.Pixel(x2,y2);
		
		var lb=projection.pointToLngLat(p1);
		
		var rt=projection.pointToLngLat(p2);
				
		bbox=lb.lng+","+lb.lat+","+rt.lng+","+rt.lat;
	
		var url ="http://101.200.104.160:80/geoserver/gsmm/wms?service=WMS&version=1.1.0&request=GetMap&layers=gsmm:gsmm2014_pt&STYLES=&TRANSPARENT=true&FORMAT=image/png&VERSION=1.1.1&srs=EPSG:4326&BBOX="+bbox+"&WIDTH=265&HEIGHT=265";
    return url;  //根据当前坐标，选取合适的瓦片图
	};
	map.addTileLayer(treeLayer);
}

 function  xqcx(townid){
 
	
    map.clearOverlays();
    if(townid!=null)
    {
     //羊坊店
    if(townid=="recYfd"){
    	
    for(var i=0;i<recYfd.length;i++)
    {
    	
    	map.addOverlay(recYfd[i]);
    }
     map.centerAndZoom(pointYfd, levelYfd);
       
   }
    //甘家口
    if(townid=="recGjk"){
    	
        for(var i=0;i<recGjk.length;i++)
        {
        	
        	map.addOverlay(recGjk[i]);
        }
         map.centerAndZoom(pointGjk, levelGjk);
           
       }
    //八里庄
    if(townid=="recBlzjdbsc"){
    	
        for(var i=0;i<recBlzjdbsc.length;i++)
        {
        	
        	
        	map.addOverlay(recBlzjdbsc[i]);
        }
         map.centerAndZoom(pointBlzjdbsc, levelBlzjdbsc);
           
       }

    //紫竹院
    if(townid=="recZzy"){
    	
        for(var i=0;i<recZzy.length;i++)
        {
        	
        	map.addOverlay(recZzy[i]);
        }
         map.centerAndZoom(pointZzy, levelZzy);
           
       }
    //北下关
    if(townid=="recBxg"){
    	
        for(var i=0;i<recBxg.length;i++)
        {
        	
        	map.addOverlay(recBxg[i]);
        }
         map.centerAndZoom(pointBxg, levelBxg);
           
       }
    //北太平庄
    if(townid=="recBtpzjd"){
    	
        for(var i=0;i<recBtpzjd.length;i++)
        {
        	
        	map.addOverlay(recBtpzjd[i]);
        }
         map.centerAndZoom(pointBtpzjd, levelBtpzjd);
           
       }
    //海淀
    if(townid=="recHdx"){
    	
        for(var i=0;i<recHdx.length;i++)
        {
        	
        	map.addOverlay(recHdx[i]);
        }
         map.centerAndZoom(pointHdx, levelHdx);
           
       }
    //中关村
    if(townid=="recZgcjdbsc"){
    	
        for(var i=0;i<recZgcjdbsc.length;i++)
        {
        	
        	map.addOverlay(recZgcjdbsc[i]);
        }
         map.centerAndZoom(pointZgcjdbsc, levelZgcjdbsc);
           
       }
    //学院路
    if(townid=="recXyljdbsc"){
    	
        for(var i=0;i<recXyljdbsc.length;i++)
        {
        	
        	map.addOverlay(recXyljdbsc[i]);
        }
         map.centerAndZoom(pointXyljdbsc, levelXyljdbsc);
           
       }
    //清河
    if(townid=="recQhjdbsc"){
    	
        for(var i=0;i<recQhjdbsc.length;i++)
        {
        	
        	map.addOverlay(recQhjdbsc[i]);
        }
         map.centerAndZoom(pointQhjdbsc, levelQhjdbsc);
           
       }
    //青龙桥
    if(townid=="recQlqjdbsc"){
    	
        for(var i=0;i<recQlqjdbsc.length;i++)
        {
        	
        	map.addOverlay(recQlqjdbsc[i]);
        }
         map.centerAndZoom(pointQlqjdbsc, levelQlqjdbsc);
           
       }
    //香山街道
    if(townid=="recXsjdbsc"){
    	
        for(var i=0;i<recXsjdbsc.length;i++)
        {
        	
        	map.addOverlay(recXsjdbsc[i]);
        }
         map.centerAndZoom(pointXsjdbsc, levelXsjdbsc);
           
       }
    //马连洼
    if(townid=="recMlwjdbsc"){
    	
        for(var i=0;i<recMlwjdbsc.length;i++)
        {
        
        	map.addOverlay(recMlwjdbsc[i]);
        }
         map.centerAndZoom(pointMlwjdbsc, levelMlwjdbsc);
           
       }
    //花园路
    if(townid=="recHyljdbsc"){
    	
        for(var i=0;i<recHyljdbsc.length;i++)
        {
        	map.addOverlay(recHyljdbsc[i]);
        }
         map.centerAndZoom(pointHyljdbsc, levelHyljdbsc);
           
       }
    //田村
    if(townid=="recTcljdbsc"){
    	
        for(var i=0;i<recTcljdbsc.length;i++)
        {
        	map.addOverlay(recTcljdbsc[i]);
        }
         map.centerAndZoom(pointTcljdbsc, levelTcljdbsc);
           
       }
    //上地
    if(townid=="recSd"){
    	
        for(var i=0;i<recSd.length;i++)
        {
        	map.addOverlay(recSd[i]);
        }
         map.centerAndZoom(pointSd, levelSd);
           
       }
    //曙光
    if(townid=="recSgjdbsc"){
    	
        for(var i=0;i<recSgjdbsc.length;i++)
        {
        	map.addOverlay(recSgjdbsc[i]);
        }
         map.centerAndZoom(pointSgjdbsc, levelSgjdbsc);
           
       }
    //燕园
    if(townid=="recYyjdbsc"){
    	
        for(var i=0;i<recYyjdbsc.length;i++)
        {
        	map.addOverlay(recYyjdbsc[i]);
        }
         map.centerAndZoom(pointYyjdbsc, levelYyjdbsc);
           
       }
    //清华园	
    if(townid=="recQhy"){
    	
        for(var i=0;i<recQhy.length;i++)
        {
        	map.addOverlay(recQhy[i]);
        }
         map.centerAndZoom(pointQhy, levelQhy);
           
       }
    //永定路
    if(townid=="recYdljdbsc"){
    	
        for(var i=0;i<recYdljdbsc.length;i++)
        {
        	map.addOverlay(recYdljdbsc[i]);
        }
         map.centerAndZoom(pointYdljdbsc, levelYdljdbsc);
           
       }
    //东升乡
    if(townid=="recDsdqbsc"){
    	
        for(var i=0;i<recDsdqbsc.length;i++)
        {
        	map.addOverlay(recDsdqbsc[i]);
        }
         map.centerAndZoom(pointDsdqbsc, levelDsdqbsc);
           
       }
    //四季青镇
    if(townid=="recSjqz"){
    	
        for(var i=0;i<recSjqz.length;i++)
        {
        	map.addOverlay(recSjqz[i]);
        }
         map.centerAndZoom(pointSjqz, levelSjqz);
           
       }
    //西北旺镇
    if(townid=="recXbwz"){
    	
        for(var i=0;i<recXbwz.length;i++)
        {
        	map.addOverlay(recXbwz[i]);
        }
         map.centerAndZoom(pointXbwz, levelXbwz);
           
       }
    //温泉
    if(townid=="recWqz"){
    	
        for(var i=0;i<recWqz.length;i++)
        {
        	map.addOverlay(recWqz[i]);
        }
         map.centerAndZoom(pointWqz, levelWqz);
           
       }
    //苏家坨镇
    if(townid=="recSjtz"){
    	
        for(var i=0;i<recSjtz.length;i++)
        {
        	map.addOverlay(recSjtz[i]);
        }
         map.centerAndZoom(pointSjtz, levelSjtz);
           
       }
    //上庄镇
    if(townid=="recSzz"){
    	
        for(var i=0;i<recSzz.length;i++)
        {
        	map.addOverlay(recSzz[i]);
        }
         map.centerAndZoom(pointSzz, levelSzz);
           
       }
    //万寿路街道  
    if(townid=="recWsljdbsc"){
    	
        for(var i=0;i<recWsljdbsc.length;i++)
        {
        	map.addOverlay(recWsljdbsc[i]);
        }
         map.centerAndZoom(pointWsljdbsc, levelWsljdbsc);
           
       }
 //西三旗
    if(townid=="recXsqjdbsc"){
    	
        for(var i=0;i<recXsqjdbsc.length;i++)
        {
        	map.addOverlay(recXsqjdbsc[i]);
        }
         map.centerAndZoom(pointXsqjdbsc, levelXsqjdbsc);
           
       }
    //万柳
    //if(townid=="recWldqbsc"){
    	
      //  for(var i=0;i<recWldqbsc.length;i++)
        //{
        	//map.addOverlay(recWldqbsc[i]);
        //}
         //map.centerAndZoom(pointWldqbsc, levelWldqbsc);
           
       //}
    if(townid=="recHdjdbsc"){
        for(var i=0;i<recHdjdbsc.length;i++)
        {
        	map.addOverlay(recHdjdbsc[i]);
        }
         map.centerAndZoom(pointHdjdbsc, levelHdjdbsc);
           
       }
}
}

/**
 * WMS,海淀区图
 */
function addHDlayer(){
	var bdary = new BMap.Boundary();
	bdary.get("北京市海淀区", function(rs){       //获取行政区域
		map.clearOverlays();        //清除地图覆盖物       
		var count = rs.boundaries.length; //行政区域的点有多少个
		if (count === 0) {
			alert('未能获取当前输入行政区域');
			return ;
		}
      	var pointArray = [];
		for (var i = 0; i < count; i++) {
			var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 5, strokeColor: "#ff0000"}); //建立多边形覆盖物
			ply.setFillColor("none");
			map.addOverlay(ply);  //添加覆盖物
			pointArray = pointArray.concat(ply.getPath());
		}    
		map.setViewport(pointArray);    //调整视野                 
	});   
}

function clearLayerply(){
	map.clearOverlays(); 
}

/**
 * 根据图形的类型进行画图
 * @param model
 */
function queryByType(model) {
	map.clearOverlays();
	if (myDragflag == 1) {
		myDrag.close();
		myDragflag = 0;
	}
	markers = [];
	var styleOptions = {
		strokeColor : "blue", // 边线颜色。
		strokeWeight : 3, // 边线的宽度，以像素为单位。
		strokeOpacity : 0.5, // 边线透明度，取值范围0 - 1。
		fillOpacity : 0.5  // 边线的样式，solid或dashed。
	};
	//实例化鼠标绘制工具
	drawingManager = new BMapLib.DrawingManager(map, {
		isOpen : true, // 是否开启绘制模式
		enableDrawingTool : false, // 是否显示工具栏
		drawingToolOptions : {
			anchor : BMAP_ANCHOR_TOP_RIGHT, // 位置
			offset : new BMap.Size(5, 5), // 偏离值
			scale : 0.8  // 工具栏缩放比例
		},
		polygonOptions : styleOptions  // 多边形的样式
	
	});
	if (model == "CIRCLE") {// 圆
		drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE);// 画图模板
	}
	if (model == "RECTANGLE") {// 矩形
		drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE);// 画图模板
	}
	//添加鼠标绘制工具监听事件，用于获取绘制结果
	var circle = null;
	drawingManager.addEventListener("circlecomplete", function(e, overlay) {
		map.clearOverlays();
		
		circleQuery(overlay);//执行圆形查询
		rectangle = e;
		map.addOverlay(overlay);	
		drawingManager.close();
	});
	//添加鼠标绘制工具监听事件，用于获取绘制结果
	var rectangle = null;
	drawingManager.addEventListener("rectanglecomplete", function(e, overlay) {
		map.clearOverlays();
		rectangleQuery(overlay);//执行矩形查询
		rectangle = e;
		map.addOverlay(overlay);	
		drawingManager.close();
	});
}


//百度地图API功能
function rightMenu(){
    var menu = new BMap.ContextMenu();
	var txtMenuItem = [
	    {
	        text:'清除覆盖物',
	        callback:function(){
	        	allClear();
             }
	    },
		{
			text:'放大',
			callback:function(){map.zoomIn();}
		},
		{
			text:'缩小',
			callback:function(){map.zoomOut();}
		}

	];
	for(var i=0; i < txtMenuItem.length; i++){
		menu.addItem(new BMap.MenuItem(txtMenuItem[i].text,txtMenuItem[i].callback,100));
	}
	map.addContextMenu(menu);
}

//添加marker
function addmarker(point_x,point_y,treeid,subplace,specie,clafcation,respunits,townid,treeimage,currState){
	try{
     if(marker!=null){	
	     map.removeOverlay(marker);
	     map.clearOverlays();
	 }
	var point = new BMap.Point(point_x,point_y);
	marker = new BMap.Marker(point); //创建marker对象
    map.addOverlay(marker);
    map.centerAndZoom(point, 15);
    map.enableScrollWheelZoom();
    
    var thisPopWindow = showPopupWindow(treeid,specie,subplace,clafcation,respunits,townid,currState);
    
 	marker.addEventListener("click", function(){
 		
 		thisPopWindow.open(marker);
 		//截取出第一张图片
  		var _inx= treeimage.indexOf(';');
  		var _imgPath = "";
  		
  		if(treeimage.length!=0&&_inx == -1){ 
  			//只有一张图片，数据库没有分号时
  			_imgPath = treeid+"/"+treeimage;	
  		}
  		else if(treeimage.length==0){
  			//新增时没有上传图片
  			_imgPath="nophoto1.gif";
  		}
  		else{
  			//多张图片时
  			_imgPath = treeid+"/"+treeimage.substring(0,_inx);
  		}
  		var image="UploadImages/"+_imgPath; 
        $("#loading").attr("src", image);  
        
 	});
    markerArray["'"+treeid+"'"] = marker;
	}
	catch(err){
		alert(err.message);
	}
 };
 
 
 var markerArray = new Array();

 function clearAllMarkerObj(){

	 if(markerArray ==undefined || markerArray == null ){
		 return ;
	 }
	 
	 for(var item in markerArray){
		 map.removeOverlay(markerArray[item]);
	 }
	 markerArray = null;
	 markerArray = new Array();
	 
 }
 
 //添加marker
 function addmarkerto20(kj_query){
 	try{
 	var treeid = kj_query.treeid;
	// 小地名
 	var subplace = kj_query.subplace;
	// 树种
 	var specie = kj_query.specie;
	// 等级
 	var clafcation = kj_query.clafcation;
	// 养护单位
 	var respunits = kj_query.respunits;
	// 乡镇
 	var townid = kj_query.townid;
	//图片
 	var treeimage=kj_query.treeimage;
	// x
 	var point_x = kj_query.pointx;
	// y
 	var point_y = kj_query.pointy;
	//古树状态
 	var currState=kj_query.currState;
 	
     var point = new BMap.Point(point_x,point_y);
     
     var marker = new BMap.Marker(point); //创建marker对象
     map.addOverlay(marker);
     //显示位置
     map.centerAndZoom(point, 15);
     map.enableScrollWheelZoom();
     
     var thisPopWindow = showPopupWindow(treeid,specie,subplace,clafcation,respunits,townid,currState);
     
     marker.addEventListener("click", function(){
  		thisPopWindow.open(marker);
  		
  		//截取出第一张图片
  		var _inx= treeimage.indexOf(';');
  		var _imgPath = "";
  		if(treeimage.length!=0&&_inx == -1){ //原有方式，没有分号
  			_imgPath = treeid+"/"+treeimage;	
  		}
  		else if(treeimage.length==0){
  			_imgPath="nophoto1.gif";
  		}
  		else{
  			_imgPath = treeid+"/"+treeimage.substring(0,_inx);
  		}
  		var image="UploadImages/"+_imgPath; 
        $("#loading").attr("src", image);  
        
  	});

     markerArray["'"+treeid+"'"] = marker;
 	}
 	catch(err){
 		alert(err.message);
 	}
  };
  //marker窗口
  function showPopupWindow(_treeid,_specie,_subplace,_clafcation,_respunits,_townid,_currState){
	 var content =                                                                       
			'<img id="loading" onerror="UploadImages/nophoto1.gif" style="float:right;zoom:1;overflow:hidden;width:120px;height:155px;margin-left:3px;"/>' +
			'<div style="margin:0;line-height:20px;padding:2px;">' +
		 	'古树编号：'+_treeid+
		 	'<br/>古树品种：'+_specie+
		 	'<br/>地址：'+_subplace+
		 	'<br/>等级：'+_clafcation+
		 	'<br/>管护单位：'+_respunits+
		 	'<br/>古树现状：'+_currState+
		 	'<br/> <a onclick="showGsmm(\''+_treeid+'\')" style="color:#0099CC;text-decoration:underline;">查看古树详情信息</a>'+
		 	'</div>';
	var	popupInfoWindow = new BMapLib.SearchInfoWindow(map, content, {
		 	title  : _townid,      //标题
		 	width  : 320,             //宽度
		 	height : 160,              //高度
		 	panel  : "panel",         //检索结果面板
		 	enableAutoPan : true,     //自动平移
		 	searchTypes   :[
		             BMAPLIB_TAB_SEARCH,   //周边检索
		             BMAPLIB_TAB_TO_HERE,  //到这里去
		             BMAPLIB_TAB_FROM_HERE //从这里出发
		 	]
		});
	return popupInfoWindow;
 };
 
 /**
  * 弹出古树名木详细信息窗口
  * @param _treeid
  */
 function showGsmm(_treeid){
	//详细信息展示
		var p = $("#newGsmm").dialog({
		title : '查看古树名木('+_treeid+')',
		modal: true,
		href : 'str/MarkerShowGsmm.do',
		width : 1200,
		maximizable : true,
		height : 500,
		queryParams : {
			'query.treeid' : _treeid,
		},
		onLoad : function() {
	       showDetail();
	},
	buttons : [{
			text : "关闭窗口",
			handler : function(){
				p.dialog('close');
				}
			}]
	});	
}

//关闭左边古树查询窗口
function closeWest(){
 		 function layoutsetting(){ 
 			  setTimeout(function(){ 
 			      $('body').layout('collapse','west');	
 			  },0);	
 			  } 
 			  function a() 
 			  {   
 			    layoutsetting(); 
 			  } 
 			   $(document).ready(a); 
 	}

 	/**
 	 * 打开辖区浮动窗口
 	 */
 	var xq;
 	function openXq() {
 		var xq = $('#xqDiv').css('display');
 		if (xq == 'none') {
 			$("#xqDiv").css("display", "block");
 		} else {
 			$("#xqDiv").css("display", "none");
 		}
 	}
 	