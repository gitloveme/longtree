var geo; 
//工具菜单开关
var ismenuopen=0;

function menuopen(){
	if(ismenuopen==0){
		$("#menu").show(1000);
		ismenuopen=1;
	}else{
		$("#menu").hide(1000);
		ismenuopen=0;
	}
}
//添加拉框放大
var myDrag;
var myDragflag=0;
//拉框放大
function amplification(){
	if(myDragflag==1){
		myDrag.close();
		myDragflag=0;
	}
	myDrag = new BMapLib.RectangleZoom(map, {zoomType : 0 ,followText: "拖拽鼠标进行放大"});
	myDrag.open();
	myDragflag=1;
}
//拉框缩小
function narrow(){
	if(myDragflag==1){
		myDrag.close();
		myDragflag=0;
		}
	myDrag = new BMapLib.RectangleZoom(map, {zoomType : 1 ,followText: "拖拽鼠标进行缩小"});
	myDrag.open();
	myDragflag=1;
}
//测量距离
function distance(){
	if(myDragflag==1){
		myDrag.close();
		myDragflag=0;
	}	
	var distance = new BMapLib.DistanceTool(map);
	distance.open();
}
//计算面积
function calculate(){
	if(myDragflag==1){
		myDrag.close();
		myDragflag=0;
	}	
	var styleOptions = {
		strokeColor:"red",    //边线颜色。
		fillColor:"red",      //填充颜色。当参数为空时，圆形将没有填充效果。
		strokeWeight: 3,       //边线的宽度，以像素为单位。
		strokeOpacity: 0.8,	   //边线透明度，取值范围0 - 1。
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
//四舍五入
function ForDight(Dight,How){  
    Dight = Math.round(Dight*Math.pow(10,How))/Math.pow(10,How);  
    return Dight;  
}

//清理覆盖物
function allClear(){
	map.clearOverlays();
	movemap();
}

//拖拽地图
function movemap(){
	if(myDragflag==1){
		myDrag.close();
		myDragflag=0;
	}	
	map.enableDragging();
}

//全图
function fullMap(){
	//var point = new BMap.Point(116.401053,39.939805);
	//map.centerAndZoom(point, 12);
	
	var point = new BMap.Point(104.070859,30.661128);
	map.centerAndZoom(point, 11);  //设置中心点坐标和地图级别
}

var isPanelShow = false;
//显示结果面板动作
function showReslutPanel(){
	if (isPanelShow == false) {
		isPanelShow = true;
		$("#showPanelBtn").css({"right":"300px"});
		$("#panelWrap").css({"width":"300px","overflow":"auto"});
		$("#map").css({"marginRight":"300px"});
		$("#showPanelBtn").html("隐藏检索结果<br/>>");
	} else {
		isPanelShow = false;
		$("#showPanelBtn").css({"right":"0px"});
		$("#panelWrap").css({"width":"0px","overflow":"hidden"});
		$("#map").css({"marginRight":"0px"});
		$("#showPanelBtn").html("显示检索结果<br/><");
	}
}
var overlayFlashTimeout=null;
var G_sColor;
var G_overlay=null;
function toggle(overlay){
	var i=0;
	//G_sColor=overlay.getStrokeColor();
	if(overlayFlashTimeout){
		clearInterval(overlayFlashTimeout);
		overlayFlashTimeout=null;
		//overlay.setStrokeColor(G_sColor);
	}
	if(G_overlay){
		if( G_overlay instanceof Array){
			//for(var poly in G_overlay){
			for(var i=0,iLen=G_overlay.length;i<iLen;i++){
				poly=G_overlay[i];
				poly.show();
			}
		}else{
			G_overlay.show();
		}
	}
	G_overlay=overlay;
	overlayFlashTimeout=setInterval(function(){
		if( overlay instanceof Array){
			isVisible=overlay[0].isVisible();
		}else{
			isVisible=overlay.isVisible();
		}
		if(isVisible){
			if( overlay instanceof Array){
				for(var i=0,iLen=overlay.length;i<iLen;i++){
					 poly=overlay[i];
					poly.hide();
				}
			}else{
				overlay.hide();
			}
		}else{
			//overlay.show();
			if( overlay instanceof Array){
				for(var i=0,iLen=overlay.length;i<iLen;i++){
					 poly=overlay[i];
					poly.show();
				}
			}else{
				overlay.show();
			}
		}
		i++;
	},600);
	
}
function _getBounds(obj){
	if( obj instanceof Array){
		var bound=null;
		for(var i=0,iLen=obj.length;i<iLen;i++){
			 poly=obj[i];
			//alert(poly);
			if(bound==null){
				bound=poly.getBounds();
			}else{
				bound.extend(poly.getBounds().getSouthWest());
				bound.extend(poly.getBounds().getNorthEast());
			}				
		}
		return bound;
	}else{
		return obj.getBounds();
	}
}
var G_dataCache=null;
function queryMemberInfo(){

	var key=$("#keyword").val();
	//alert(key);
	
	clearAll();
	$("#query_content").html("");
	$.ajax({ 
	     type: "post", 
	     url: "./memberQuery.do?keyword="+encodeURI(key), 
	     dataType: "json", 
	     success: function (data) {	

			var dataList = data.datas;
			var result = "";
			result+=createPageHead(data.total);
			
			for(var k=0; k<dataList.length; k++){
				result += createOneRecord(dataList[k], k);
			}
			
			result+=createPageFooter(data.total);
			
			 
			$("#query_content").html(result);
			var opt = {callback: pageselectCallback};
			var pagination = $("#page_content").pagination(data.total, opt);
			
	     }, 
	     error: function (XMLHttpRequest, textStatus, errorThrown) { 
	             alert("查询不到相关数据："+errorThrown); 
	     } 
	});
}

/**
 * Mitchell
 * 分页查询得到结果后，显示分页描述信息，如共查询到多少条记录，共多少页
 * @returns {String}
 */
function createPageHead(count){
	var pageNums = Math.ceil(count/10);
	var pageHead = "<DIV class='pageHeader'>"+
	"&nbsp;&nbsp;<IMG width=16 height=16 src='./resource/img/icon/user_go.png'>&nbsp;&nbsp;"+
	"<SPAN onclick='NSOnClick(0)'>共查询到 "+count+" 条记录， 共  "+pageNums+"  页</SPAN>&nbsp;&nbsp;"+
	//"<SPAN onclick=''><IMG width=16 height=16 src='./resource/img/icon/upgrade.gif' onclick='history.go(-1)' title='返回'></SPAN>"+
	// '<a href="javascript:back();" class="easyui-linkbutton" data-options="plain:true,iconCls:\'icon-reload\'">返回</a>'+
	 '<a href="javascript:back()" class="easyui-linkbutton l-btn l-btn-small" data-options="iconCls:\'icon-reload\'" group="" id="">'+
	 '<span class="l-btn-left l-btn-icon-left"><span class="l-btn-text">返回</span><span class="l-btn-icon icon-reload">&nbsp;</span></span></a>'+
	"</DIV>";
	return pageHead;
}

//showUptownModifyBox()修改所需调用函数
/**
 * Mitchell
 * 分页查询得到结果后，显示分页页脚描述信息,暂时为空
 * @returns {String}
 */
function createPageFooter(count){
	var pageFooter = "<DIV class='pageHeader'>"+
	"&nbsp;&nbsp; &nbsp;&nbsp;"+
	"<SPAN onclick='NSOnClick(0)'></SPAN>&nbsp;&nbsp;"+
	"<SPAN onclick=''></SPAN>"+
	"</DIV>";
	return pageFooter;
}
/**
 * 根据当前记录行的索引，计算得到行对应要显示的图片位置
 * @param index
 * @returns {Number}
 */
function calculateImgOffset(index){
	var offset = 0;
	switch(index){
		case 8:
			offset = index*26+6;
			break;
		case 9:
			offset = index*26+7;
			break;
		default:
			offset = index*26+4;
	}
	return offset;
}
/**
 * 解析json数据，生成列表中每条记录
 * @param item
 * @param inx
 * @returns {String}
 */
function createOneRecord(item, inx){
	var offset = calculateImgOffset(inx);
	
	var record="<DIV class='recordDiv'>"+
		"<DIV class=recordIndex>"+
			//"<IMG width=40 height=40 src='mapImages/"+(inx+1)+".png'>"+
			"<div class='queryNumberTitle' style='background-position:-"+offset+"px -208px'></div>"+
		"</DIV>"+
		"<DIV class=recordCon>"+
			"<DIV class='list1'>"+
				"<SPAN onclick='NSOnClick(0)'>"+item.areaname+"</SPAN>"+
			"</DIV>"+
			"<DIV class='recordRow'>"+
				"<DIV class='recordColumn1'>小区户数： "+item.peopleCount+"</DIV>"+
				"<DIV class='recordColumn2'>会员人数： "+item.memberCount+"</DIV>"+
			"</DIV>"+
			"<DIV class='recordRow'>"+
				"<DIV class='recordColumn1'>消费人数： "+item.consumerCount+"</DIV>"+
				"<DIV class='recordColumn2'>消费笔数： "+item.consumeCount+"</DIV>"+
			"</DIV>"+
			"<DIV class='recordRow'>"+
				"<DIV class='recordColumn1'>消费店铺： "+item.shopCount+"</DIV>"+
				"<DIV class='recordColumn2'>消费金额： "+item.money+"</DIV>"+
			"</DIV>"+
		"</DIV>"+
	"</DIV>";
	return record;
}


/**
 * 回掉函数，点击分页栏的页码数，如 “ 下一页”时触发后台数据查询
 * @param page_index
 * @param jq
 * @returns {Boolean}
 */
function pageselectCallback(page_index, jq){
	//alert(page_index);
	//alert(jq);
	
	$.ajax({ 
	     type: "post", 
	     url: "./memberQuery.do?pageNum="+(page_index+1), 
	     dataType: "json", 
	     success: function (data) {	
			//alert(JSON.stringify(data));
			// update footer rows with new data
			var dataList = data.datas;
			var result = "";
			result+=createPageHead(data.total);
			for(var k=0; k<dataList.length; k++){
				result += createOneRecord(dataList[k], k);
			}
			result+=createPageFooter(data.total);
			$("#query_content").html(result);
	     }, 
	     error: function (XMLHttpRequest, textStatus, errorThrown) { 
	             alert("查询不到相关数据："+errorThrown); 
	     } 
	});
    return false;
}



/**************行政区前台分页*******************/
var mallid = "";
function pagexzq(page_index, jq){
	  var pageNum = page_index + 1;
      //每页的开始记录  第一页为1  第二页为number +1   
      var offset = (pageNum-1)*10; 
      var offend = offset + 9;
      $("#query_content").empty();
	  var result = "";
	  result+=createPageHeadxzq(datas.length);
	  if(offend>datas.length-1){
		  offend = datas.length-1;
	  }
	  var i = -1;
	  result +=   "<table  border=0 style='BORDER-COLLAPSE: collapse' borderColor=#000000 height=40 cellPadding=1 width=300 align=center id='' align='center'>";
	  result +="<DIV class='pageHeader'>"+
		"&nbsp;&nbsp; &nbsp;&nbsp;"+
		"<SPAN onclick=''>起始时间段："+start1Time+" 至 "+start2Time+"</SPAN>"+
		"</DIV>";
		result +="<DIV class='pageHeader'>"+
		"&nbsp;&nbsp; &nbsp;&nbsp;"+
		"<SPAN onclick=''>终止时间段："+end1Time+" 至 "+end2Time+"</SPAN>"+
		"</DIV>";
	  for(var k=offset; k<=offend; k++){
		  i++;
		  var position = calculateImgOffset(i)
		  result +=
    			"<tr onclick='caidan("+datas[k].aid+",this)'>" +
    			"<td  colspan='2'><div class='queryNumberTitle' style='background-position:-"+position+"px -208px'></div>"+
    			"<div class='list1'><a href=javascript:xxq("+datas[k].aid+","+mallid+")>"+datas[k].qu+"</a></div></td></tr>"
    			+"<tr id='show1' style='' class='hiddenTr'>"+
    			"<td align='center'>指标</td>"+
    			"<td align='center'>时间1</td>"+
    			"<td align='center'>时间2</td>"+
    			"<td align='center'>差异</td>"+
    			"</tr>"+
    			"<tr id='show2'style='' class='hiddenTr'>"+
				"<td align='center'>会员人数</td>"+
				"<td align='center'>"+datas[k].sj1+"</td>"+
				"<td align='center'>"+datas[k].sj2+"</td>"+
				"<td align='center'>"+getDiffImg(datas[k].chayi)+"</td>"+
				"</tr>"+
               "<tr id='show6' style=''  class='hiddenTr'>"+
            	"<td align='center'>消费人数</td>"+
            	"<td align='center'>"+datas[k].xfrsks+"</td>"+
				"<td align='center'>"+datas[k].xfrsjs+"</td>"+
				"<td align='center'>"+getDiffImg(datas[k].xfrschayi)+"</td>"+
            	"</tr>"+
            	"<tr id='show7' style='' class='hiddenTr'>"+
            	"<td align='center'>消费笔数</td>"+
            	"<td align='center'>"+datas[k].xfbsks+"</td>"+
				"<td align='center'>"+datas[k].xfbsjs+"</td>"+
				"<td align='center'>"+getDiffImg(datas[k].xfbschayi)+"</td>"+
            	"</tr>"+
            	"<tr id='show8' style='' class='hiddenTr'>"+
            	"<td align='center'>消费金额</td>"+
            	"<td align='center'>"+datas[k].xfjeks+"</td>"+
				"<td align='center'>"+datas[k].xfjejs+"</td>"+
				"<td align='center'>"+getDiffImg(datas[k].xfjechayi)+"</td>"+
            	"</tr>";
		}
	  result += "</table>";
	  result +=createPageFooter(datas.length);
      $("#query_content").html(result.replace(null, "0"));
      return false;                
}
/*****************************小区后台分页********************/

function xiaoqupage(page_index, jq){

    $("#query_content").empty();
    
	var urls = "dbfxxiaoqu.do?pageNum="+(page_index+1)
	+"&startTimeks=" + start1Time + "&startTimejs="
	+ start2Time + "&endTimeks=" + end1Time + "&endTimejs=" + end2Time
	+ "&keywords=" + xiaoqukey+"&mid="+xqmid+"&area="+xqareaid;
	urls = encodeURI(urls);
	var result = "";
	result +=   "<table  border=0 style='BORDER-COLLAPSE: collapse' borderColor=#000000 height=40 cellPadding=1 width=300 align=center id='' align='center'>";
	$.ajax({
		type : "get",
		url : urls,
		dataType : "json",
		success : function(data) {
		total = data.total;
		
		result += createPageHeadback1(total,xqmid);
		result +="<DIV class='pageHeader'>"+
		"&nbsp;&nbsp; &nbsp;&nbsp;"+
		"<SPAN onclick=''>起始时间段："+start1Time+" 至 "+start2Time+"</SPAN>"+
		"</DIV>";
		result +="<DIV class='pageHeader'>"+
		"&nbsp;&nbsp; &nbsp;&nbsp;"+
		"<SPAN onclick=''>终止时间段："+end1Time+" 至 "+end2Time+"</SPAN>"+
		"</DIV>";
		$.each(data, function(index,values){ // 解析出data对应的Object数组  
			$.each(values,function(index2,value){
            	result += createXqxx(value,index2);
			}); 
    });
			  result += "</table>";
			  result +=createPageFooter(total);
			  $("#query_content").html(result.replace(null, "0"));
		
		}
	});
    return false;                
}

//小区消费会员信息分页
function pageXfhy(page_index, jq){
	$.ajax({ 
	     type: "post", 
	     url: "xqxfhyxx.do?pageNum="+(page_index+1)+"&hid="+xfhyhid+"&mid="+xfhymid+"&startTime="+xfhysj1+"&endTime="+xfhysj2, 
	     dataType: "json", 
	     success: function (data) {	
			var dataList = data.datas;
			var result = "";
			result+=createPageHeadback(data.total,xfhymid,xfhyaid);//，如共查询到多少条记录，共多少页
			$.each(data, function(index,values){ 
				$.each(values,function(index2,value){
					result += createxfrsxx(value, index2);// 消费的会员信息
				});
				});
			result+=createPageFooter(data.total);
			$("#query_content").html(result.replace(null, "0"));
	     }, 
	     error: function (XMLHttpRequest, textStatus, errorThrown) { 
	             alert("查询不到相关数据："+errorThrown); 
	     } 
	});
    return false;
}
/*************小区会员的详细信息分页************************/
function xqhyxxPage(page_index, jq){
	$.ajax({ 
	     type: "post", 
	     url: "xqhyxx.do?pageNum="+(page_index+1)+"&hid="+xfhyhid+"&mid="+xfhymid+"&startTime="+xfhysj1+"&endTime="+xfhysj2, 
	     dataType: "json", 
	     success: function (data) {	
		
			var dataList = data.datas;
			var result = "";
			result+=createPageHeadback(data.total,xfhymid,xfhyaid);//，如共查询到多少条记录，共多少页

			$.each(data, function(index,values){ 
				$.each(values,function(index2,value){
					result += createhyxx(value, index2);//小区会员信息
				});
				});
			result+=createPageFooter(data.total);
			$("#query_content").html(result.replace(null, "0"));
	     }, 
	     error: function (XMLHttpRequest, textStatus, errorThrown) { 
	             alert("查询不到相关数据："+errorThrown); 
	     } 
	});
   return false;
}
var colorArr = new Array();
colorArr["2007"]="#FF0033";
colorArr["2008"]="#0000FF";
colorArr["2009"]="#00FF00";
var G_PG=null;
//封装气泡框
function openInfoWindow(pointstr, str,center,mc,jsnd) {
	isPanelShow=true;
	showReslutPanel();
	var polygon=null;
	$('#showPanelBtn').hide();
	if(pointstr.indexOf("|")>0){
		polygon=new Array();
		var pointstrif=pointstr.split("|");
		for(var h=0;h<pointstrif.length;h++){
			var Points=new Array();
			var pointArr=pointstrif[h].split(";");
			for(var i=0;i<pointArr.length;i++){
				Points[i]=new BMap.Point(pointArr[i].split(",")[0],pointArr[i].split(",")[1]);
			}
			var polygon1 = new BMap.Polygon(Points, {strokeColor:colorArr[2007], strokeWeight:2, strokeOpacity:1, fillColor:colorArr[2007], fillOpacity:0.01});
			var zsearchInfoWindow = new BMapLib.SearchInfoWindow(map, str, {
				title  : "<div style='font-weight: bolder;color: #C52;'>"+mc+" </div>",      //标题
				width  : 320,             //宽度
				height : 230,              //高度
				panel  : "panel",         //检索结果面板
				enableAutoPan : true,     //自动平移
				searchTypes   :[
					BMAPLIB_TAB_SEARCH,   //周边检索
					BMAPLIB_TAB_TO_HERE,  //到这里去
					BMAPLIB_TAB_FROM_HERE //从这里出发
				]
			});
			var point = new BMap.Point(center.split(",")[0],center.split(",")[1]);
			var marker = new BMap.Marker(point);
			polygon1.infowin=zsearchInfoWindow;
			polygon1.marker=marker;
			polygon1.point=point;
			polygon1.addEventListener("click", function(e){
				openWin(zsearchInfoWindow,marker,point);
				toggle(polygon1._array);
				/*if(G_PG){
			G_PG.disableEditing();
			}*/
			//polygon.enableEditing();
			//document.getElementById("name").value=mc;
			//G_PG=polygon;	
			});
			map.addOverlay(polygon1);
			polygon1._array=polygon;
			polygon.push(polygon1);
		}
	}else{
		var Points=new Array();
		var pointArr=pointstr.split(";");
		for(var i=0;i<pointArr.length;i++){
			Points[i]=new BMap.Point(pointArr[i].split(",")[0],pointArr[i].split(",")[1]);
		}
		polygon = new BMap.Polygon(Points, {strokeColor:colorArr[2007], strokeWeight:2, strokeOpacity:1, fillColor:colorArr[2007], fillOpacity:0.01});
		var zsearchInfoWindow = new BMapLib.SearchInfoWindow(map, str, {
			title  : "<div style='font-weight: bolder;color: #C52;'>"+mc+":</div>",      //标题
			width  : 320,             //宽度
			height : 230,              //高度
			panel  : "panel",         //检索结果面板
			enableAutoPan : true,     //自动平移
			searchTypes   :[
				BMAPLIB_TAB_SEARCH,   //周边检索
				BMAPLIB_TAB_TO_HERE,  //到这里去
				BMAPLIB_TAB_FROM_HERE //从这里出发
			]
		});
		
		var point = new BMap.Point(center.split(",")[0],center.split(",")[1]);
		var marker = new BMap.Marker(point);
		polygon.infowin=zsearchInfoWindow;
		polygon.marker=marker;
		polygon.point=point;
		polygon.addEventListener("click", function(e){
			openWin(zsearchInfoWindow,marker,point);
			toggle(polygon);
			/*if(G_PG){
				G_PG.disableEditing();
			}
			polygon.enableEditing();
			G_PG=polygon;
			document.getElementById("name").value=mc;*/
			//document.getElementById("infoArea").value=pnts2Str(geo);
		});
		map.addOverlay(polygon);
	}
	G_dataCache[mc]=polygon;
}
function clearAll(){
	clearInterval(overlayFlashTimeout);
	overlayFlashTimeout=null;
	clearUptownOverlay();
}
function undo(){
	if(G_PG){
		G_PG.disableEditing();
	}
}
function getPNT(){
geo=G_PG.getPath();
//G_PG=polygon;
//document.getElementById("infoArea").value=pnts2Str(geo);
	document.getElementById("infoArea").value=pnts2Str(geo);
}

//打开气泡框
function openWin(win,mark,point){
	//map.centerAndZoom(point, 15);
	win.close();
	win.open(mark);
	win.localSearch.setSearchCompleteCallback(function(){
		openResultListPanel();
	});
	win.transitRoute.setSearchCompleteCallback(function(){
		openResultListPanel();
	});
	win.drivingRoute.setSearchCompleteCallback(function(){
		openResultListPanel();
	});
}



var G_isDiffopen=0;

function _cancelBubble(e){
	if(e && e.stopPropagation){
	    e.stopPropagation();
	}else{
	    window.event.cancelBubble = true;
	}
}





/**
 * 改变省份
 * @param dom
 */
 /*
function changePro(dom) {
	$("#citySel2").empty(); 
	$("#districtSel2").empty(); 
	var pid = $(dom).val();
	$.ajax({
		type : "get",
		url : "querycitybyID.do?pid=" + pid,
		success : function(data) {
			$.each(data, function(j, item) {
				 var temp2= "&";
					if(item.coords!=""){
						
					var coor = item.coords.split(" ");
					
					 temp2=coor[0]+"&"+coor[1];
					}
					//& 分割id和坐标
				var str2 = "<option value=" + item.cid + "&" + temp2
				+ ">" + item.cityName + "</option>";
				if (j == 0) {
					 var coords = item.coords;
					 if(coords!=""){
						 coords=coords.split(" ");
						 var point = new BMap.Point(coords[0],coords[1]);
						 map.panTo(point); 
					 }
					 
		
					// 查询默选城市对应地区
					$.ajax({
						type : "get",
						url : "queryareas.do?cid=" + item.cid,
						success : function(data) {
							$("#districtSel2").append(
									"<option value=-1>--请选择--</option>");
							$.each(data, function(k, item) {
								 var temp= "&";
								if(item.coords!=""){
									
								var coor = item.coords.split(" ");
								
								 temp=coor[0]+"&"+coor[1];
								}
								
								
								 
								var str3 = "<option value=" + item.aid + "&"
										+ temp+ ">" + item.areaName
										+ "</option>";

								$(str3).appendTo($("#districtSel2"));
							});

						}
					});

				}
				$(str2).appendTo($("#citySel2"));

			});

		}

	});

}
*/
/**
 * 改变城市
 */
 /*
function changeCity(dom){
	$("#districtSel2").empty();
	var val = $(dom).val();
	var arr = val.split("&");
	if(arr[2]!="")
		{

		var centerPoint = new BMap.Point(arr[1],
				arr[2]);
		map.centerAndZoom(centerPoint, 11);
		}
	
	   $.ajax({
			type : "get",
			url : "queryareas.do?cid=" + arr[0],
			success : function(data) {
				
				$("#districtSel2").append(
				"<option value=-1>--请选择--</option>");
		$.each(data, function(k, item) {
			 var temp= "&";
			if(item.coords!=""){
				
			var coor = item.coords.split(" ");
			
			 temp=coor[0]+"&"+coor[1];
			}
			
			
			 
			var str3 = "<option value=" + item.aid + "&"
					+ temp+ ">" + item.areaName
					+ "</option>";

			$(str3).appendTo($("#districtSel2"));
		});

			}
		});
    
	
	
	
}
*/
/**
 * 改变地区
 * @param pME
 */
 /*
function changeDistrict(pME){

	
	var val = $(pME).val();
	var arr = val.split("&");
	if(val!=-1){

	if(arr[2]!="")
		{

		var centerPoint = new BMap.Point(arr[1],
				arr[2]);
		map.centerAndZoom(centerPoint, 12);
		}
	}
	else{
	
		if(arr[2]!="")
		{
			var arr2 = $("#citySel2").val().split("&");

		var centerPoint = new BMap.Point(arr2[1],
				arr2[2]);
		map.centerAndZoom(centerPoint, 11);
		}
		
	}
	
}
*/


/**
 * 选择城市列表中的某一个，切换显示地图导航栏上的城市
 * @param pME
 */
function changeCity(pME){
	  var cid = $(pME).attr("attr-id");
	  var cname = $(pME).attr("title");
	  map.centerAndZoom(cname, 11);
	  $("#districtSel").css("display","none");
	   $("#districtSel").html("");
	   $("#districtSel").attr("data-options","");
	try{
	 
	 
	   $(pME).parent().children().removeClass("current"); 
	   $(pME).addClass("current");  
	   
	   if(pME.title == '四川省'){
		   
		   map.centerAndZoom("成都市", 11);
		   $("#citySel").attr("data-options","");
		   $("#citySel").css("display","none");
		   $("#citySel").html("");
		   $("#districtSel").attr("data-options","");
		   $("#districtSel").html("");
		   cnames="成都市";
		   $("#provinceSel").find("SPAN[class='menu-rightarrow']").removeClass("menu-rightarrow"); 
		   $("#provinceSel").find("SPAN[class='']").addClass("m-btn-downarrow"); 
	   }
	   else{
		   

		 
		   
		   $.ajax({
				type : "get",
				url : "queryareas.do?cid=" + cid,
				success : function(data) {
					var html= "<dl class='fn-clear city-select-district'> <dd>";
			
					$.each(data, function(i, item) {
						
						html+="<a title='"+item.areaName+"' coords='"+item.coords+"' attr-id='"+item.aid+"' href='javascript:void(0)' onclick='javascript:changeDistrict(this);'>"+item.areaName+"</a>";
						/*var optarea = $("<option></option>");
						optarea.attr("value", item.aid);
						optarea.text(item.areaName);
						$("#area").append(optarea);*/
					});
					html+="	</dd></dl>";
					$("#districtList").html(html);
				}
			});
	   
		   $('#citySel').menubutton({
		    	menu: '#districtList'
		   });
		   
		   var currentCity = '<span class="l-btn-left"><span class="l-btn-text">'+pME.title+'</span><span class="m-btn-downarrow"></span><span class="m-btn-line"></span></span>';
		   $("#citySel").html(currentCity);
		   $("#citySel").attr("data-options",cid);
		   $("#citySel").css("display","");
		   $("#districtSel").css("display","");
		   $("#districtSel").html("");
		   $("#districtSel").attr("data-options","");
		   $("#provinceSel").find("SPAN[class='m-btn-downarrow']").removeClass("m-btn-downarrow"); 
		   $("#provinceSel").find("SPAN[class='']").addClass("menu-rightarrow"); 
		   
		  
	   }
	}
	catch(err){
		alert(err.message);
	}
}

function changeDistrict(pME){
	var point = $(pME).attr("coords");

	var coords = point.split(" ");
	
	
	var centerPoint = new BMap.Point(coords[0],coords[1]);
	map.centerAndZoom(centerPoint, 12); // 初始化地图,设置中心点坐标和地图级别
	

//	   alert('java');
	try{
		   $(pME).parent().children().removeClass("current"); 
		   $(pME).addClass("current");  
		   
		/*   if(pME.title == '成都市'){
			   $("#districtSel").css("display","none");
			   $("#districtSel").html("");
			   $("#citySel").find("SPAN[class='menu-rightarrow']").removeClass("menu-rightarrow"); 
			   $("#citySel").find("SPAN[class='']").addClass("m-btn-downarrow"); 
		   }
		   else{*/
/*			   alert($(pME).attr("attr-id"));*/
			   var aid = $(pME).attr("attr-id");
			   $("#districtSel").html(pME.title);
			   $("#districtSel").attr("data-options",aid);
			   $("#districtSel").css("display","");
			   $("#citySel").find("SPAN[class='m-btn-downarrow']").removeClass("m-btn-downarrow"); 
			   $("#citySel").find("SPAN[class='']").addClass("menu-rightarrow"); 
		   /*}*/
		}
		catch(err){
			alert(err.message);
		}
	
}

$(document).ready(function(){
	 
	var ddlMenu =  $('#provinceSel').menubutton({
    	menu: '#cityList'
    });
	
	$("#citySel").css("display","none");
	$("#districtSel").css("display","none");
    
});


/**
 * 显示对比分析弹出层窗口
 */
function showCompareAnalysisBox() {
	
	$.fancybox.open({
		//href : 'http://www.baidu.com',  
		 href : "compareAnalysis.jsp",
		 type : 'iframe',
		 id:'compareAnalysisIframe',
		 padding : 3,
		 scrolling: 'no',
	     fitToView: true,
	     width: 480,
	     height: 430,
	     autoSize: false,
	     closeClick: false
	});
	//document.frames['compareAnalysisIframe'].load();
}

/**
 * 显示对比分析弹出层窗口
 */
function showUptownModifyBox() {
	$.fancybox.open({
		//href : 'http://www.baidu.com',  
		 href : "uptownModify.jsp",
		 type : 'iframe',
		 padding : 5,
		 scrolling: 'no',
	     fitToView: true,
	     width: 610,
	     height: 470,
	     autoSize: false,
	     closeClick: false
	});
}