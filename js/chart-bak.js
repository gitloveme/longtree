
    
 /***
  *构建饼状图图表
  * @param div
  * @param title
  * @param data
  * @param func
  * @param key
  * @return
  */
	//饼图填充色库hegw
	//var colorsLibrary=["#FF0000","#FFFF33","#3300FF","#00FF33","#CC00FF","#CC9900","#CCFFFF","#CCCC00","#FF3333","#0033FF"];
	var colorsLibrary=["#79b2c5","#30629f","#a5322f","#769538","#725399","#319db9","#ed8127","#8aa6d5","#d78788","#b9d290"];
    function buildPieChart(div,title,data){
    	var _chartData=null;
    	if(data!=null){
    		_chartData=new Array();
    		var a1=data.split("|");
    		var j=0;
    		for(var i=0;i<a1.length;i++){
    			var b1=a1[i].split(':');
		    	var itemDatahgw=new Object();
		    	itemDatahgw.name=b1[0];
    		    itemDatahgw.y=Number(b1[1]);
    		    itemDatahgw.color=colorsLibrary[j];
    			j++;
    			if(j>colorsLibrary.length){j=0;}
    			_chartData.push(itemDatahgw);
    		}
    	}
    	
    	var chart = new Highcharts.Chart({
            chart: {
                renderTo: div,  
                width:900,
                height:280,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            //设置图例位置、大小hegw
            legend: {
	            align: 'right',
	            verticalAlign: 'top',
	            x: 0,
	            y: 1,
	            width: 100,
	            itemWidth:100
	        },
	        
            title: {
                text: '<b>'+title+'</b>',
                style:{
                	fontSize: '18px',
                    fontFamily: '黑体'
                }
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+this.point.name +'</b>: '+ this.y +","+ Highcharts.numberFormat(this.percentage,1)+' %';//鼠标经过提示
                }
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+this.point.name +'</b>: '+ this.y ;//+' ,'+ Highcharts.numberFormat(this.percentage,1)+' %';//周边提示this.percentage
                        }
                    },
                    //显示图例hegw true/false
                    showInLegend: false,
                    
					events:{
						//单击事件
						click: function(e) {
							
						}
					}
                }
            },
            series: [{
                type: 'pie',
                data: _chartData
            }]
        });
    }
    /*
     * 构建柱状图
     * @param {Object} div
     * @param {Object} title
     * @param {Object} data
     * @memberOf {TypeName} 
     * @return {TypeName} 
     */
    function buildBarChart(div,title,data){
    	var _chartData=null;
    	var xText=null;
    	if(data!=null){
    		_chartData=new Array();
    		xText=new Array();
    		var a1=data.split("|");
    		var j=0;
    		for(var i=0;i<a1.length;i++){
    			var b1=a1[i].split(':');
    			xText.push(b1[0]);
		    	//自定义饼图颜色，由原来的[name,value],形式，改成{name: 'Chrome',y: 12.8,color: '#FF0000'},形式hegw
		    	var itemDatahgw=new Object();
		    	itemDatahgw.name=b1[0];
    		    itemDatahgw.y=Number(b1[1]);
    		    itemDatahgw.color=colorsLibrary[j];
    			j++;
    			if(j>colorsLibrary.length){j=0;}
    			_chartData.push(itemDatahgw);
    		}
    	}
    	
        var chart = new Highcharts.Chart({ 
            chart: { 
                renderTo: div, //图表放置的容器，关联DIV#id  
                width:900,
                height:280,
                zoomType: 'xy'   //X、Y轴均可放大 
            }, 
            title: { 
                text: '<b>'+title+'</b>',
                style:{
                	fontSize: '18px',
                    fontFamily: '黑体'
                } //图表标题 
            }, 
            xAxis: { //X轴标签 
                categories: xText,//['2010年3月', '2010年4月', '2010年5月', '2010年6月', '2010年7月'], 
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '12px',
                        fontFamily: '宋体'
                    }
                }
            }, 
            yAxis:{ //设置Y轴-第二个（金额） 
                //gridLineWidth: 1,  //设置网格宽度为0，因为第一个Y轴默认了网格宽度为1 
            	min: 0,
                title: {text: ''},//Y轴标题设为空 
                allowDecimals:false,//不显示小数属性
                labels: { 
                    formatter: function() {//格式化标签名称 
                        return this.value; 
                    }, 
                    style: { 
                        color: '#4572A7' //设置标签颜色 ,蓝色：#4572A7；
                    } 
                } 
                
            }, 
            plotOptions: { 
				series: { 
					cursor: 'pointer', 
					events: { 
						click: function(e) { //就是这里的事件响应不了。而且我不太会调试，希望得到大家指点！ 
							//var a =e.point.x;
							//func(xText[a]);
						} 
					} 
				},column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    pointWidth: 15
                }  
            }, 

            tooltip: { //鼠标滑向数据区显示的提示框 
                formatter: function() {  //格式化提示框信息 
                    return '' + this.x + ': ' + this.y+''; 
                } 
            }, 
            
            series: [{  //数据列 
                name: '数量', 
                color: '#4572A7', //蓝色：4572A7
                type: 'column', //类型：纵向柱状图 
                yAxis: 0, //数据列关联到Y轴，默认是0，设置为1表示关联上述第二个Y轴即金额 
                data: _chartData//[59.95, 55.55, 57.7, 81.15, 58.87] //金额数据 
                ,
                dataLabels: {
                    enabled: true,
                    rotation: 0,
                    color: '#000000',
                    align: 'center',
                    x: 0,
                    y: -2,
                    style: {
                        fontSize: '13px',
                        fontFamily: 'Verdana, sans-serif'
                    }
                }
            }] 
        }); 
    }
    /**
     * 折线图
     * @param {Object} div
     * @param {Object} title
     * @param {Object} data
     * @memberOf {TypeName} 
     * @return {TypeName} 
     */
     function buildLineChart(div,title,data){
    	 var xText=null;
    	 var xData=null;
    	if(data!=null){
    		var a1=data.split("|");
    		xText=new Array();
    		xData=new Array();
    		for(var i=0;i<a1.length;i++){
    			var b1=a1[i].split(':');
    			xText.push(b1[0]);
    			xData.push(Number(b1[1]));
    	    	continue;
    		}
    	}
    	 var chart = new Highcharts.Chart({
            chart: {
                renderTo: div, 
                width:900,
                height:280,
                zoomType: 'xy'   //X、Y轴均可放大 
            },
            title: {
                text: '<b>'+title+'</b>',
                x: -20,//center
                style:{
                	fontSize: '18px',
                    fontFamily: '黑体'
                } 
            },
            xAxis: {
                categories: xText,
                labels: {
                    rotation: -45,
                    align: 'right',
                    style: {
                        fontSize: '12px',
                        fontFamily: '宋体'
                    }
                }
            },
            yAxis: {
            	min: 0,
                title: {
                    text: ''//Y轴标题
                },
                allowDecimals:false,//不显示小数属性
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'//#808080
                }]
            },
            tooltip: {
                formatter: function() {
                        return this.x +': '+ this.y ;
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: [{
                name: '数量',
                yAxis: 0, //数据列关联到Y轴，默认是0，设置为1表示关联上述第二个Y轴即金额 
                data: xData
            }]
        });
     }
      function buildBarsChart(div,tableId,data){
    	if(data!=null){
    		document.getElementById(tableId).innerText="";
    		var cf=data.split(";;");
    		var itemData;
    		var xText=new Array();
    		var xData=new Array();
    		var xText1=cf[0].split(",");
    		var Html="<table id='datatable' >"+
    			"<thead>"+
    			"<tr>"+
    			"<th></th>";
    		//一系列的标签
    		for(var i=0;i<xText1.length;i++){
    			Html+="<th>"+xText1[i]+"</th>";
    			xText.push(xText1[i]);
    		}
    		Html+="</tr>"+
    			"</thead>"+
    			"<tbody>";
    		//alert(cf[1]);
    		var xText2=cf[1].split(",");//标签上的分组
    		for(var j=0;j<xText2.length;j++){
    			Html+="<tr>"+
    				"<th>"+xText2[j]+"</th>";
    				var d=j+2;
    				if(d<cf.length){
    					var theDate=cf[d].split(",");
		    			for(var f=0;f<theDate.length;f++){
		    				Html+="<td>"+theDate[f]+"</td>";
		    			}
    				}
	    			
    	    	Html+="</tr>";
    		}
    		Html+="</tbody>"+
    		"</table>";
    		$("#"+tableId).append(Html); 
    	}
    	Highcharts.visualize = function(table, options) {
            // the categories
            options.xAxis.categories = [];
            $('tbody th', table).each( function(i) {
                options.xAxis.categories.push(this.innerHTML);
            });
    
            // the data series
            options.series = [];
            $('tr', table).each( function(i) {
                var tr = this;
                $('th, td', tr).each( function(j) {
                    if (j > 0) { // skip first column
                        if (i == 0) { // get the name and init the series
                            options.series[j - 1] = {
                                name: this.innerHTML,
                                data: [],
                                dataLabels: {
				                    enabled: true,
				                    rotation: 0,
				                    color: '#000000',
				                    align: 'center',
				                    x: 0,
				                    y: -2,
				                    style: {
				                        fontSize: '13px',
				                        fontFamily: 'Verdana, sans-serif'
				                    }
				                }
                            };
                        } else { // add values
                            options.series[j - 1].data.push(parseFloat(this.innerHTML));
                        }
                    }
                });
            });
    
            var chart = new Highcharts.Chart(options);
        }
    
        var table = document.getElementById("datatable"),
        options = {
            chart: {
                renderTo: div,
                type: 'column'
            },
            title: {
                text: ''
            },
            xAxis: {
            	labels: { 
                    rotation: 0,  //逆时针旋转45°，标签名称太长。 
                    align: 'center' , //设置right右对齐 
                    y:20
                } 
            },
            yAxis: {
                title: {
                    text: ''
                },
                allowDecimals:false//不显示小数属性
            },
            tooltip: {
                formatter: function() {
                    return '<b>'+ this.series.name +'</b><br/>'+
                        this.x.toLowerCase()+' '+ this.y ;
                }
            }
        };
    
        Highcharts.visualize(table, options);
    	
    }
      
function yObj(){
	this.name;
	this.data;
}
/**
 * 多线
 * @param {Object} div
 * @param {Object} title
 * @param {Object} data
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
 function buildLinesChart(div,title,data){
    	var dateArray=new Array();
    	if(data!=null){
    		var allD=data.split(";;");
    		var xTD=allD[0].split(',');
    		var xText=new Array();//x轴标签
    		for(var i=0;i<xTD.length;i++){
    			xText.push(xTD[i]);//x轴标签
    		}
    		var yTD=allD[1].split(',');
    		for(var j=0;j<yTD.length;j++){
    			var dataObj= new yObj();
    			dataObj.name=yTD[j];//数据name
    			var yD=allD[j+2].split(',');
    			var isData= new Array();
    			for(var k=0;k<yD.length;k++){
    				isData.push(parseInt(yD[k]));
    			}
    			dataObj.data=isData;//数据data
    			dateArray.push(dataObj);
    		}
    		
    	}else{
    		return;
    	}
    	 chart = new Highcharts.Chart({
            chart: {
                renderTo: div,
                type: 'line',
                marginRight: 130,
                marginBottom: 25
            },
            title: {
                text: title,
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
            	categories: xText, //['管理员', '地方', '个人', '行政']
            	labels: { 
                    rotation: 0,  //逆时针旋转45°，标签名称太长。 
                    align: 'center' , //设置right右对齐 
                    y:20
                } 
            },
            yAxis: {
                title: {
                    text: ''
                },
                
                allowDecimals:false,//不显示小数属性
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'+
                        this.x +': '+ this.y +'';
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: 100,
                borderWidth: 0
            },
            series: dateArray
        });
     }
 function yData(){
	this.y;
	this.color;	
	this.drilldown;
}
function yText(){
	this.name;
	this.categories	;
	this.data;
	this.color;
}
/**
 * 多饼
 * @param {Object} div
 * @param {Object} title
 * @param {Object} data
 * @memberOf {TypeName} 
 * @return {TypeName} 
 */
  function buildPiesChart(div,title,data){
	  var colors = Highcharts.getOptions().colors;
	  if(data!=null){
		  
		  	var allD=data.split(";;");
    		
			var xTD=allD[0].split(',');
			var xText=new Array();//外圈标签
			for(var i=0;i<xTD.length;i++){
				xText.push(xTD[i]);//外圈标签
			}
			
			var categoriesTD=allD[1].split(',');
			var categoriesT=new Array();//内圈标签
			for(var j=0;j<categoriesTD.length;j++){
				categoriesT.push(categoriesTD[j]);//内圈标签
			}
			
			var dataArray=new Array();//整体数据
			for(var k=2;k<allD.length;k++){
				var dataObj=new yData();
				var isData=0;
				
				dataObj.color=colors[k];
				var valS=allD[k].split(',');
				var drilldownArray= new yText();
				var val=new Array();
				for(var f=0;f<valS.length;f++){
					val.push(parseInt(valS[f]));
					isData+=parseInt(valS[f]);
				}
				dataObj.y=isData;
				drilldownArray.name=categoriesT[k-2];
				drilldownArray.categories=xText;
				drilldownArray.data=val;
				drilldownArray.color=colors[k];
				dataObj.drilldown=drilldownArray;
				dataArray.push(dataObj);
			}
	  }else{
		  return;
	  }
	  categories = categoriesT,//内圈标签
            name = '',
            data =dataArray;
    
    
        // Build the data arrays
        var browserData = [];
        var versionsData = [];
        for (var i = 0; i < data.length; i++) {
    
            // add browser data
            browserData.push({
                name: categories[i],
                y: data[i].y,
                color: data[i].color
            });
    
            // add version data
            for (var j = 0; j < data[i].drilldown.data.length; j++) {
                var brightness = 0.2 - (j / data[i].drilldown.data.length) / 5 ;
                versionsData.push({
                    name: data[i].drilldown.categories[j],
                    y: data[i].drilldown.data[j],
                    color: Highcharts.Color(data[i].color).brighten(brightness).get()
                });
            }
        }
    
        // Create the chart
        chart = new Highcharts.Chart({
            chart: {
                renderTo: div,
                type: 'pie'
            },
            title: {
                text: ''
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                pie: {
                    shadow: false
                }
            },
            tooltip: {
        	    valueSuffix: ''
            },
            series: [{
                name: '&nbsp;',
                data: browserData,
                size: '60%',
                dataLabels: {
                    formatter: function() {
                        return this.y > 5 ? this.point.name : null;
                    },
                    color: 'white',
                    distance: -30
                }
            }, {
                name: '&nbsp;',
                data: versionsData,
                innerSize: '60%',
                dataLabels: {
                    formatter: function() {
                        // display only if larger than 1
                        return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.y +''  : null;
                    }
                }
            }]
        });
  }