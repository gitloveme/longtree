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
    addOverlayTree();
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
/*获取古树详细信息*/
function lodeTreeDetail(nubmer){
	$.ajax({
		"type":"get",
		url:"/inf/getTree",
		data:{NO:nubmer},
		dataType:"jsonp",
		error:function (error){
			dialogMessage("古树详情","很抱歉暂时无法查看古树详情，请您稍后重试");
		},
		success:function (data){
			if(data.status==200){
				var obj=data.data;
				var images=obj.picture.split(",");
				var windowDom=$(".window-detail");
				var imgDom='';
				var imglen=images.length;
				if(imglen<1){//暂无照片
					imgDom+='<img src="/images/notree.jpg" class="curr-img">';
				}else if(imglen==1){
					imgDom+='<img src="'+images[0]+'" class="curr-img">';
				}else if(imglen==2){
					imgDom+='<img src="'+images[0]+'" class="pre-img">';
					imgDom+='<img src="'+images[1]+'" class="curr-img">';
				}else{
					for(var i=0;i<imglen;i++){
						if(i==0){
							imgDom+='<img src="'+images[i]+'" class="pre-img">';
						}else if(i==1){
							imgDom+='<img src="'+images[i]+'" class="curr-img">';
						}else if(i==2){
							imgDom+='<img src="'+images[i]+'" class="next-img">';
						}else{
							imgDom+='<img src="'+images[i]+'">';
						}
					}
				}
				
				windowDom.find(".change-box").html(imgDom);
				
				windowDom.find(".treeno").html("NO."+obj.NO).sibling(".treedes").find(".des-en").html(obj.small_place).siblings(".des-cn").html('<em class="icon ico-ori"></em>'+obj.product_place);
				
				var introhtml='<ul class="clear">'+
									'<li>原挂牌号：'+obj.quotation+'</li>'+
									'<li>特征代码：'+obj.feature_no+'</li>'+
									'<li>所属区县：'+obj.county+'</li>'+
									'<li>古树等级：'+obj.grade+'</li>'+
									'<li>树种：'+obj.tree_seed+'</li>'+
									'<li>估测树龄：'+obj.estimation_age年+'</li>'+
									'<li>真实树龄：'+obj.real_age年+'</li>'+
									'<li>树高：'+obj.higth米+'</li>'+
									'<li>胸径(主蔓径)：'+obj.chest厘米+'</li>'+
									'<li>生长势：'+obj.growth_vigor+'</li>'+
									'<li>生长环境：'+obj.growth_enviro+'</li>'+
									'<li>特点：'+obj.feature+'</li>'+
								'</ul>'+
								'<div class="tree-type"><span class="before"></span><span class="tree-title">位置</span><span class="after"></span></div>'+
								'<ul class="clear">'+
									'<li>乡镇：'+obj.town+'</li>'+
									'<li>村(居委会)：'+obj.villiage+'</li>'+
									'<li>小地名：'+obj.small_place+'</li>'+
									'<li>生长场所：'+obj.product_place+'</li>'+
									'<li>现存状态：'+obj.exist_state+'</li>'+
									'<li>调查号：'+obj.survey_no+'</li>'+
									'<li>海拔：'+obj.altitude+'</li>'+
								'</ul>'+
								'<div class="tree-type"><span class="before"></span><span class="tree-title">树冠</span><span class="after"></span></div>'+
								'<ul class="clear">'+
									'<li>东西树冠：'+obj.east_crown+'</li>'+
									'<li>南北树冠：'+obj.south_crown+'</li>'+
									'<li>平均树冠：'+obj.aver_crown+'</li>'+
								'</ul>'+
								'<div class="tree-type"><span class="before"></span><span class="tree-title">管护</span><span class="after"></span></div>'+
								'<ul class="clear">'+
									'<li>管护单位：'+obj.manage_com+'</li>'+
									'<li>管护人：'+obj.manage_people+'</li>'+
								'</ul>';
				windowDom.show().find(".tree-intro").empty().html(introhtml);
				
			}else{
				var errormsg=data.error || "很抱歉暂时无法查看古树详情，请您稍后重试";
				dialogMessage("古树详情",errormsg);
			}
		}
	});
}
//打开窗口

var searchList=$(".search-list");
var lodeUrl='/inf/getLocation';
function loadSearchData(op){
	var option=$.extend({page_index:1,page_num:50},op);
    $.ajax({
        type:"get",
        url:lodeUrl,
        data:option,
        dataType:"json",
        error:function (error){console.error("获取信息出错")},
        success:function (data){

			if(data && data.status == 200){
                var arry=data.data || [];
                if(arry.length<1) return false;
                var table='<table>';
                for(var i=0;i<arry.length;i++){
                    var NO=arry[i].NO || "树木编号";
                    var treeAdress=arry[i].town || "-";
                    var treeName=arry[i].tree_seed || "-";
                    var lng=arry[i].X || 0;
                    var lat=arry[i].Y || 0;
                    table+='<tr lng="'+lng+'" lat="'+lat+'" postnum="'+postNum+'" type="'+treeName+'" address="'+treeAdress+'">'+
                               '<td>'+NO+'</td>'+
                               '<td>'+treeAdress+'</td>'+
                               '<td>'+treeName+'</td>'
                            '</tr>';
					
					////////
					var iconUrl="http://123.56.168.10/images/tree3.png";
					switch(treeName){
						case "侧柏":
							iconUrl="http://123.56.168.10/images/tree3.png";
							break;
						case "水杉":
							iconUrl="http://123.56.168.10/images/tree1.png";
							break;
						case "皂角":
							iconUrl="http://123.56.168.10/images/tree2.png";
							break;
						case "白玉兰":
							iconUrl="http://123.56.168.10/images/tree4.png";
							break;
						default:
							iconUrl="http://123.56.168.10/images/tree3.png";
							break;
					}
					var myIcon = new BMap.Icon(iconUrl, new BMap.Size(24,24));
					var point = new BMap.Point(lng,lat);
					var marker = new BMap.Marker(point,{icon:myIcon});
					map.addOverlay(marker);
					var NO=baiduData[i].NO || 0;
					var sContent ='<div class="window" style="display:block;position:relative;"><div class="close-window">×</div>'+
							'<img src="http://123.56.168.10/images/tree-des-1.jpg" class="treeimg" alt="'+treeName+'">'+
							'<div class="btn-more"  number="'+NO+'">'+
								'<em class="icon ico-eye"></em><a>查看详情</a>'+
							'</div>'+
							'<div class="icon ico-arrow" style="left:157px;"></div>'+
							'<p class="treeno">NO.'+NO+'</p>'+
							'<div class="treedes">'+
								'<h3>'+treeName+'</h3>'+
								'<p class="des-en">Pinus tabuliformis Carrière</p>'+
								'<p class="des-cn"><em class="icon ico-ori"></em>'+treeAdress+'</p>'+
							'</div>'+
						'</div>';
					addClickHandler(sContent,marker);
                }
				table+='</table>';
                var totalcount=data.records || 0;
                var pagehtml=returnPagehtml(option.page_index,totalcount,option.page_num);
				
				searchList.find(".pagenumber").empty().html(pagehtml).delegate("a","click",function (){
					var t=$(this);
					if(t.hasClass("now") || t.hasClass("last")) return false;
					var number=t.attr("page");
					if(lodeUrl.indexOf("/inf/searchTree")!=-1){//搜索后翻页
						var keyword=$.trim($(".searchvalue").val());
						if(keyword==""){
							dialogMessage("搜索","搜索内容不能为空");
						}
						var option={keyword:keyword,page_index:number};
						loadSearchData(option);
					}else{
						loadSearchData({page_index:number,type:2});
					}
					
				});
                searchList.show().find(".autoscroll").empty().html(table).delegate("tr","click",function (){
					var that=$(this);
                    that.addClass("active").siblings("tr").removeClass("active");
					
					var coordX=that.attr("lng");
					var coordY=that.attr("lat");
                    var NO=that.attr("postnum");
					var treeName=that.attr("type");
					var treeAddress=that.attr("address");
                   //////
					var point = new BMap.Point(coordX,coordY);
					map.centerAndZoom(point, 18);
					var sContent ='<div class="window" style="display:block;position:relative;"><div class="close-window">×</div>'+
						'<img src="http://123.56.168.10/images/tree-des-1.jpg" class="treeimg" alt="'+treeName+'">'+
						'<div class="btn-more" number="'+NO+'">'+
							'<em class="icon ico-eye"></em><a>查看详情</a>'+
						'</div>'+
						'<div class="icon ico-arrow" style="left:157px;"></div>'+
						'<p class="treeno">NO.'+NO+'</p>'+
						'<div class="treedes">'+
							'<h3>'+treeName+'</h3>'+
							'<p class="des-en">Pinus tabuliformis Carrière</p>'+
							'<p class="des-cn"><em class="icon ico-ori"></em>'+treeAddress+'</p>'+
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
						lodeTreeDetail($(this).attr("number"));
						//$(".window-detail").show();
					});
				});
                searchList.find(".autoscroll").find("tr").eq(0).find("td").each(function (i,ele){
                        searchList.find(".copytable").find("th").eq(i).width($(ele).width());
                     }); 
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
							lodeTreeDetail($(this).attr("number"));
							//$(".window-detail").show();
						});
				}
            }else{
				var errormsg=data.error || '登录出现错误，请您重试'
					dialogMessage("古树信息",errormsg);
			}
        }
    });
}
$(".submit-search").click(function (){
	lodeUrl='/inf/searchTree';
	var keyword=$.trim($(".searchvalue").val());
	if(keyword==""){
		dialogMessage("搜索","搜索内容不能为空");
	}
	var option={keyword:keyword};
	loadSearchData(option);
}).sibling(".searchvalue").keydown(function (e){
	if(e.which===13){
		$(this).siblings(".submit-search").click();
	}
});
function init(){
    getBoundary("昌平区");
    loadSearchData({type:2});
    //addTreeTileLayer();
    //addOverlayTree();
}
init();
